import React, { useRef, useState } from 'react';
import { images } from '../../Assets';
// import { images } from '../../../Assets';
// import './style.css';

const ImageUpload = ({ setFieldValue, error }) => {
    const [previewImage, setPreviewImage] = useState();
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setPreviewImage(URL.createObjectURL(file));
        setFieldValue('image', file);
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="BannerBoxMain">
            <label className="mainLabel px-0 mb-3">Upload Image</label>
            <div className={`BannerBoxMainImg ${!previewImage ? 'uploadIcon' : ''} mb-2`}>
                <img
                    src={previewImage ?? images.uploadIcon}
                    alt="product"
                    className={previewImage ? 'uploaded' : ''}
                    onClick={previewImage ? handleImageClick : undefined}
                    style={{ cursor: previewImage ? 'pointer' : 'default' }}
                />
                {!previewImage && (
                    <>
                        <p className="mb-0">Drop Your Image Here</p>
                        <input
                            type="file"
                            accept="image/*"
                            className="site-btn primary-btn"
                            id="profileImageNew"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                        />
                    </>
                )}
                {previewImage && (
                    <input
                        type="file"
                        accept="image/*"
                        className="site-btn primary-btn"
                        id="profileImageNew"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                )}

            </div>
            {previewImage && (
                <label
                    htmlFor="files"
                    className="mb-3 text-center w-100"
                >
                    Click Image to replace or update
                </label>
            )}


            {error && <div className="errorText red-text">{error}</div>}
        </div>
    );
};

export default ImageUpload;
