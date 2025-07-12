import multer from 'multer';
import path from 'path';
import { logger } from '../utils/logger.js';
// Cấu hình multer cho file upload
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    // Danh sách định dạng được phép
    const allowedTypes = ['.pdf', '.txt', '.jpg', '.png'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExtension)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`));
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1 // Chỉ 1 file
    }
});
// Middleware kiểm tra file upload
export const validateFileUpload = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                logger.warn('File too large', { fileName: req.file?.originalname });
                return res.status(400).json({
                    error: 'File quá lớn. Kích thước tối đa: 5MB'
                });
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                logger.warn('Too many files uploaded');
                return res.status(400).json({
                    error: 'Chỉ được phép tải lên 1 file duy nhất'
                });
            }
            logger.error('Multer error', { error: err.message });
            return res.status(400).json({ error: 'Lỗi upload file' });
        }
        if (err) {
            logger.error('File validation error', { error: err.message });
            return res.status(400).json({ error: err.message });
        }
        // Kiểm tra xem có file được upload không
        if (!req.file) {
            logger.warn('No file uploaded');
            return res.status(400).json({ error: 'Vui lòng chọn file để tải lên' });
        }
        logger.info('File uploaded successfully', {
            fileName: req.file.originalname,
            fileSize: req.file.size,
            mimeType: req.file.mimetype
        });
        next();
    });
};
// Hàm kiểm tra file (có thể dùng ở nơi khác)
export const validateFile = (file) => {
    const allowedTypes = ['.pdf', '.txt', '.jpg', '.png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const fileExtension = path.extname(file.originalname).toLowerCase();
    // Kiểm tra định dạng
    if (!allowedTypes.includes(fileExtension)) {
        return {
            isValid: false,
            error: `Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`
        };
    }
    // Kiểm tra kích thước
    if (file.size > maxSize) {
        return {
            isValid: false,
            error: `File quá lớn. Kích thước tối đa: 5MB`
        };
    }
    return { isValid: true };
};
