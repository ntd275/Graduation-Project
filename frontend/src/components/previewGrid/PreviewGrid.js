import React, { useEffect, useRef, useState } from "react";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { IconClose2 } from "../Icon/Icons";
import "./PreviewGrid.scss";
import { baseUrl } from "../../api/Api";

function PreviewGrid({ files, setFiles, isView, onClick }) {
    const divRef = useRef(null);
    const [currentWidth, setCurrentWidth] = useState(0);

    useEffect(() => {
        setCurrentWidth(divRef.current?.offsetWidth);
    }, [divRef.current?.offsetWidth]);

    const removeFile = (file) => {
        setFiles(files.filter((element) => element !== file));
    };

    const fileRender = (file, height, moreFileSize) => {
        const fileUrl =
            typeof file.content === "string"
                ? baseUrl + "\\" + file.content
                : URL.createObjectURL(file.content);
        const preview = () => {
            if (file.type === "image") {
                return <img src={fileUrl} alt="" style={{ height: height }} />;
            }
            return (
                <video style={{ height: height }}>
                    <source src={fileUrl} />
                </video>
            );
        };
        return (
            <div className="image">
                {preview()}
                {file.type === 'video' && <div className="mask">
                    <PlayCircleOutlineIcon sx={{transform: 'scale(2)'}}/>
                </div>}
                {!isView && !moreFileSize && (
                    <div
                        className="btn-remove"
                        onClick={() => removeFile(file)}
                    >
                        <IconClose2 />
                    </div>
                )}
                {!!moreFileSize && <div className="mask">+{moreFileSize}</div>}
            </div>
        );
    };
    const getImageLayout = () => {
        if (files.length === 1) {
            return (
                <div className="image-container-1">
                    {fileRender(files[0], currentWidth)}
                </div>
            );
        }
        if (files.length === 2) {
            return (
                <div className="image-container-2">
                    {fileRender(files[0], currentWidth / 2)}
                    {fileRender(files[1], currentWidth / 2)}
                </div>
            );
        }
        if (files.length === 3) {
            return (
                <>
                    <div className="image-container-1">
                        {fileRender(files[0], currentWidth / 2)}
                    </div>
                    <div className="image-container-2">
                        {fileRender(files[1], currentWidth / 2)}
                        {fileRender(files[2], currentWidth / 2)}
                    </div>
                </>
            );
        }
        if (files.length === 4) {
            return (
                <>
                    <div className="image-container-2">
                        {fileRender(files[0], currentWidth / 2)}
                        {fileRender(files[1], currentWidth / 2)}
                    </div>
                    <div className="image-container-2">
                        {fileRender(files[2], currentWidth / 2)}
                        {fileRender(files[3], currentWidth / 2)}
                    </div>
                </>
            );
        }
        if (files.length === 5) {
            return (
                <>
                    <div className="image-container-2">
                        {fileRender(files[0], currentWidth / 2)}
                        {fileRender(files[1], currentWidth / 2)}
                    </div>
                    <div className="image-container-3">
                        {fileRender(files[2], currentWidth / 3)}
                        {fileRender(files[3], currentWidth / 3)}
                        {fileRender(files[4], currentWidth / 3)}
                    </div>
                </>
            );
        }
        if (files.length > 5) {
            return (
                <>
                    <div className="image-container-2">
                        {fileRender(files[0], currentWidth / 2)}
                        {fileRender(files[1], currentWidth / 2)}
                    </div>
                    <div className="image-container-3">
                        {fileRender(files[2], currentWidth / 3)}
                        {fileRender(files[3], currentWidth / 3)}
                        {fileRender(
                            files[4],
                            currentWidth / 3,
                            files.length - 4
                        )}
                    </div>
                </>
            );
        }
    };
    return (
        <div ref={divRef} className="file-post-grid" onClick={onClick}>
            {getImageLayout()}
        </div>
    );
}

export default PreviewGrid;
