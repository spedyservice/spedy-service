const Service = require('../models/Service');
const cloudinaryService = require('../config/cloudinary');

// ──────────────────────────────────────────────
// getServices – modified to sort and place "Other Electronics" last
// ──────────────────────────────────────────────
const getServices = async (req, res) => {
  try {
    const { isActive, popular, featured } = req.query;
    let query = {};

    if (isActive === 'true') query.isActive = true;
    if (popular === 'true') query.popular = true;
    if (featured === 'true') query.featured = true;

    let services = await Service.find(query).sort('displayOrder');

    // Move "Other Electronics" to the end of the array
    services = services.sort((a, b) => {
      const aIsOther = a.name === 'Other Electronics';
      const bIsOther = b.name === 'Other Electronics';
      if (aIsOther && !bIsOther) return 1;
      if (!aIsOther && bIsOther) return -1;
      return 0;
    });

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch services'
    });
  }
};

const getPopularServices = async (req, res) => {
  try {
    const services = await Service.getPopularServices(6);
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Get popular services error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch popular services'
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Get service by ID error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch service' });
  }
};

const getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Get service by slug error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch service' });
  }
};

const toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    service.isActive = !service.isActive;
    service.updatedAt = Date.now();
    await service.save();

    res.json({
      success: true,
      message: `Service ${service.isActive ? 'activated' : 'deactivated'} successfully`,
      data: service
    });
  } catch (error) {
    console.error('Toggle service status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to toggle service status'
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    // Delete image from Cloudinary if exists
    if (service.imageUrl) {
      const parts = service.imageUrl.split('/');
      const folderAndFile = parts.slice(-2).join('/');
      const publicId = folderAndFile.split('.')[0];
      await cloudinaryService.deleteImage(publicId);
    }

    await service.deleteOne();
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete service'
    });
  }
};

const createService = async (req, res) => {
  try {
    const serviceData = { ...req.body };

    if (req.file) {
      const result = await cloudinaryService.uploadBuffer(req.file.buffer, {
        folder: 'mondal-electronics/services',
      });
      serviceData.imageUrl = result.url;
    }

    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Create service error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Service with this name already exists' });
    }
    res.status(400).json({ success: false, message: error.message || 'Failed to create service' });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    let imageUrl = service.imageUrl;

    if (req.file) {
      if (service.imageUrl) {
        const parts = service.imageUrl.split('/');
        const folderAndFile = parts.slice(-2).join('/');
        const publicId = folderAndFile.split('.')[0];
        await cloudinaryService.deleteImage(publicId);
      }

      const result = await cloudinaryService.uploadBuffer(req.file.buffer, {
        folder: 'mondal-electronics/services',
      });
      imageUrl = result.url;
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { ...req.body, imageUrl, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService
    });
  } catch (error) {
    console.error('Update service error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Service with this name already exists' });
    }
    res.status(400).json({ success: false, message: error.message || 'Failed to update service' });
  }
};

module.exports = {
  getServices,
  getServiceById,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  getPopularServices,
  toggleServiceStatus
};