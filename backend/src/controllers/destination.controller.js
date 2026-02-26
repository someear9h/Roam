const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDestination = async (req, res) => {
  const name = req.params.name;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Destination name is required' });
  }

  const dest = await prisma.destination.findUnique({ where: { name } });
  res.json({ success: true, data: dest || {} });
};

exports.getVrAssets = async (req, res) => {
  const name = req.params.name;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Destination name is required' });
  }

  const dest = await prisma.destination.findUnique({ where: { name }, select: { vr_assets: true } });
  res.json({ success: true, data: dest ? dest.vr_assets : [] });
};

exports.getVrAssetsByTrip = async (req, res) => {

  try {

    const tripId = Number(req.params.tripId);

    if (isNaN(tripId)) {
      return res.status(400).json({
        success:false,
        error:"Invalid tripId"
      });
    }

    const trip = await prisma.trip.findUnique({
      where:{ id:tripId }
    });

    if (!trip) {
      return res.status(404).json({
        success:false,
        error:"Trip not found"
      });
    }


    /*
    DESTINATION VR
    */

    const destination = await prisma.destination.findUnique({
      where: { name: trip.destination },
      select: { vr_assets: true }
    });

    const rawAssets = Array.isArray(destination?.vr_assets) ? destination.vr_assets : [];

    const destinations = rawAssets
      .filter((a) => a !== null && a !== undefined)
      .map((asset, index) => {
        const obj = typeof asset === 'string' ? { panorama: asset } : asset;
        const panorama = obj?.panorama || obj?.url || obj?.image || '';
        const embed_url = obj?.embed_url || obj?.embedUrl || '';
        const thumbnail = obj?.thumbnail || obj?.preview || '';
        const type = obj?.type || (embed_url ? 'kuula' : 'image');

        return {
          id: obj?.id || `dest-${index}`,
          name: obj?.name || trip.destination,
          location: obj?.location || trip.destination,
          thumbnail,
          panorama,
          embed_url,
          type,
          rating: obj?.rating || 4.8,
          highlights: obj?.highlights || [],
          amenities: obj?.amenities || [],
          views: obj?.views || []
        };
      });



    /*
    HOTEL VR
    */

    const hotelsDB =
      await prisma.hotel.findMany({
        where:{ destination:trip.destination }
      });


    const hotels = hotelsDB.map(hotel => {

      // Normalize `hotel.vr_assets` into an array we can safely map over.
      let rawHotelAssets = hotel.vr_assets;

      if (typeof rawHotelAssets === 'string') {
        try {
          rawHotelAssets = JSON.parse(rawHotelAssets);
        } catch (e) {
          rawHotelAssets = [rawHotelAssets];
        }
      }

      if (rawHotelAssets && !Array.isArray(rawHotelAssets)) {
        rawHotelAssets = [rawHotelAssets];
      }

      const firstAsset = Array.isArray(rawHotelAssets) ? rawHotelAssets[0] : undefined;

      const views = (Array.isArray(rawHotelAssets) ? rawHotelAssets : [])
        .filter(a => a != null)
        .map((asset, index) => ({
          id: `${hotel.id}-${index}`,
          name: asset?.name || 'Room',
          panorama: asset?.url || asset?.panorama || '',
          thumbnail: asset?.thumbnail || '',
          type: asset?.type || 'image'
        }));

      return {
        id: hotel.id,
        name: hotel.name,
        location: hotel.area,
        rating: hotel.rating || 4.5,
        thumbnail: firstAsset?.thumbnail,
        views
      };

    });


    /*
    IMPORTANT RESPONSE FORMAT
    */

    // Primary contract: `{ success: true, data: [...] }`
    // Backwards-compatible: keep `destinations`/`hotels` keys too.
    res.json({
      success: true,
      data: destinations,
      destinations,
      hotels
    });

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      success:false,
      error:"Failed to load VR assets"
    });

  }

};

exports.listDestinations = async (req, res) => {
  try {
    const items = await prisma.destination.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true }
    });
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('listDestinations error', err);
    res.status(500).json({ success: false, error: 'Failed to list destinations' });
  }
};

