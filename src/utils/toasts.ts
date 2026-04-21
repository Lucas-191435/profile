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

const infoToast = ({ description }: ToastProps) => {
  toast.info(description);
};

export { successToast, errorToast, infoToast };
