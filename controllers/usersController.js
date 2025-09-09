const User = require("../models/User");

const getTodaysUsers = async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const users = await User.find({
        createdAt: {
            $gte: today,
            $lt: tomorrow
        }
    }).lean();

    if (!users?.length) {
        return res.status(200).json({ message: 'No users found for today', users: [] });
    }
    res.json({ users });
};

// Helper function to escape CSV fields
const escapeCSVField = (field) => {
    if (field == null) return '';
    const stringField = String(field);
    // If field contains comma, quote, or newline, wrap in quotes and escape quotes
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return '"' + stringField.replace(/"/g, '""') + '"';
    }
    return stringField;
};

const downloadTodaysUsers = async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const users = await User.find({
        createdAt: {
            $gte: today,
            $lt: tomorrow
        }
    }).lean();

    if (!users?.length) {
        return res.status(200).json({ message: 'No users found for today' });
    }

    // Arabic headers for better user experience
    const headers = ['الاسم', 'البريد الإلكتروني', 'تاريخ التسجيل'];
    let csv = headers.join(',') + '\n';

    // Add data rows with proper escaping
    users.forEach(user => {
        const row = [
            escapeCSVField(user.username),
            escapeCSVField(user.email),
            escapeCSVField(new Date(user.createdAt).toLocaleString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }))
        ];
        csv += row.join(',') + '\n';
    });

    // Add UTF-8 BOM for Excel compatibility with Arabic text
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csv;

    // Set proper headers for Arabic CSV download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=مستخدمي_اليوم.csv');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.send(csvWithBOM);
};

const getAllUsers = async (req, res) => {
    const users = await User.find({}).lean();

    if (!users?.length) {
        return res.status(200).json([]);
    }
    res.json(users);
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (password !== '0011') {
        return res.status(403).json({ message: 'Invalid password' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
};

module.exports = { getTodaysUsers, downloadTodaysUsers, getAllUsers, deleteUser };