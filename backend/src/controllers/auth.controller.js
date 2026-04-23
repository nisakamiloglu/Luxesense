const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, employeeId, storeLocation } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, phone, role, employeeId, storeLocation });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
exports.logout = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('assignedAdvisorId', 'name email employeeId storeLocation');
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/lis  — save quiz result (LIS segment: Premium 22-30, Selective 12-21, Explorer 0-11)
exports.saveLIS = async (req, res, next) => {
  try {
    const { score, segment, notifPref } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { lis: { score, segment, notifPref, lastUpdated: new Date() } },
      { new: true }
    );
    res.json({ success: true, lis: user.lis });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/advisor/customers  — advisor gets their linked customers
exports.getAdvisorCustomers = async (req, res, next) => {
  try {
    const advisor = await User.findById(req.user.id);
    if (advisor.role !== 'advisor') {
      return res.status(403).json({ success: false, message: 'Not an advisor' });
    }
    const customers = await User.find({ assignedAdvisorId: req.user.id })
      .select('name email phone lis loyaltyPoints totalSpent createdAt');
    res.json({ success: true, customers });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/assign-advisor  — admin/advisor assigns a customer (advisor calls this)
exports.assignCustomer = async (req, res, next) => {
  try {
    const { customerEmail } = req.body;
    const advisor = await User.findById(req.user.id);
    if (advisor.role !== 'advisor') {
      return res.status(403).json({ success: false, message: 'Not an advisor' });
    }
    const customer = await User.findOne({ email: customerEmail, role: 'customer' });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    await User.findByIdAndUpdate(customer._id, { assignedAdvisorId: advisor._id });
    if (!advisor.assignedCustomerIds.includes(customer._id)) {
      await User.findByIdAndUpdate(advisor._id, { $push: { assignedCustomerIds: customer._id } });
    }
    res.json({ success: true, message: `${customer.name} assigned to ${advisor.name}` });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/update-profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
