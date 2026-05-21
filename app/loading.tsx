import { Loader } from "lucide-react";
import React from "react";
const Loading = () => {
    return (
        <div>
             <div className="text-center mt-4 text-lg text-muted-foreground">
               <Loader className="w-5 h-5 animate-spin" /> Loading...
             </div>
        </div>
    )
}
export default Loading;