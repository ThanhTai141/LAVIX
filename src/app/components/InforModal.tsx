
interface InforModalProps {
    isOpen: boolean;
    onClose: () => void;
}
const InforModal: React.FC<InforModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Thông tin</h2>
        <p className="text-gray-700 mb-4">Đây là một modal thông tin.</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};
export default InforModal;