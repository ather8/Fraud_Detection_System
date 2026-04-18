import { Navigate } from "react-router-dom";
import { auth } from "@/lib/auth";

const Index = () => <Navigate to={auth.isAuthed() ? "/app/predict" : "/"} replace />;
export default Index;
