import { toast } from "sonner";

interface ToastProps {
  description?: string;
}
const successToast = ({ description }: ToastProps) => {
  toast.success(description);
};

const errorToast = ({ description }: ToastProps) => {
  toast.error(description);
};

export { successToast, errorToast };
