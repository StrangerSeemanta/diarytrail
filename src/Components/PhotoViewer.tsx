import { IconButton, Image } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Fragment } from "react/jsx-runtime";

interface PhotoViewerProps {
    children: ReactNode;
    src: string | undefined;
}

function PhotoViewer({ children, src }: PhotoViewerProps) {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };


    return (
        <Fragment>
            {isFullScreen ? (
                <div
                    className=" fixed  top-0 left-0 h-screen flex justify-center items-center z-50 bg-zinc-900/95 w-full "
                >
                    <IconButton onClick={toggleFullScreen} aria-label="toggle-FullScr" sx={{ position: "absolute ", top: "10px", right: "20px" }}>
                        <IoClose size={20} />
                    </IconButton>
                    <Image

                        objectFit={"contain"}
                        src={src}
                        className="max-w-full max-h-full animate-popup"
                    />
                </div>
            ) : (
                <>
                    <div
                        className="cursor-pointer hover:brightness-90"
                        onClick={toggleFullScreen}
                    >
                        {children}
                    </div>

                </>
            )}
        </Fragment>
    );
}

export default PhotoViewer;
