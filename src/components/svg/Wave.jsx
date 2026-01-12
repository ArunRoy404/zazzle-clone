import React from 'react';

const Wave = ({className}) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="1094" height="504" viewBox="0 0 1094 504" fill="none">
            <path d="M-31 0.731934C-6.16667 63.8986 99.3 190.232 322.5 190.232C601.5 190.232 610 355.232 763.5 423.732C886.3 478.532 1034.33 498.232 1093 501.232" stroke="url(#paint0_linear_40016572_885)" strokeWidth="4" strokeDasharray="10 10" />
            <defs>
                <linearGradient id="paint0_linear_40016572_885" x1="-54.5" y1="103.232" x2="1112" y2="542.232" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#83D0D2" />
                    <stop offset="1" stopColor="white" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default Wave;