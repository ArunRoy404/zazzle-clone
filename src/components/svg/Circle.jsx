import React from 'react';

const Circle = ({ colorOut = '#C67A6A', colorIn = '#FC815F', className }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none" className={className}>
            <circle cx="30.75" cy="30.75" r="26" transform="rotate(11.7503 30.75 30.75)" fill={colorOut} />
            <g filter="url(#filter0_i_40016453_3114)">
                <circle cx="30.7501" cy="30.7502" r="22.2857" transform="rotate(11.7503 30.7501 30.7502)" fill={colorIn} />
            </g>
            <g filter="url(#filter1_i_40016453_3114)">
                <circle cx="30.75" cy="30.7501" r="14.8571" transform="rotate(11.7503 30.75 30.7501)" fill="#D9D9D9" />
            </g>
            <defs>
                <filter id="filter0_i_40016453_3114" x="8.45977" y="8.45996" width="48.2949" height="52.0091" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="3.71429" dy="7.42857" />
                    <feGaussianBlur stdDeviation="3.71429" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_40016453_3114" />
                </filter>
                <filter id="filter1_i_40016453_3114" x="15.8899" y="15.8901" width="29.7202" height="37.1488" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="7.42857" />
                    <feGaussianBlur stdDeviation="3.71429" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_40016453_3114" />
                </filter>
            </defs>
        </svg>
    );
};

export default Circle;