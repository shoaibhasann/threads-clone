import { useSelector } from "react-redux"

export const useAuth = () => {
    const auth = useSelector((state) => state?.auth);

    return auth;
}