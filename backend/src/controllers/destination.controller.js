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