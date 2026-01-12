import { Balloon, Bear, Cake, Cherry, } from '../../svg/Stickers';
import Sticker from './Sticker';

const stickers = [
    {
        icon: Cherry,
        url: '/assets/stickers/cherry.svg'
    },
    {
        icon: Cake,
        url: '/assets/stickers/cake.svg'
    },
    {
        icon: Bear,
        url: '/assets/stickers/bear.svg'
    },
    {
        icon: Balloon,
        url: '/assets/stickers/balloon.svg'
    },
    {
        icon: Cherry,
        url: '/assets/stickers/cherry.svg'
    },
    {
        icon: Cake,
        url: '/assets/stickers/cake.svg'
    },
    {
        icon: Bear,
        url: '/assets/stickers/bear.svg'
    },
    {
        icon: Balloon,
        url: '/assets/stickers/balloon.svg'
    },
    {
        icon: Cherry,
        url: '/assets/stickers/cherry.svg'
    },
    {
        icon: Cake,
        url: '/assets/stickers/cake.svg'
    },
    {
        icon: Bear,
        url: '/assets/stickers/bear.svg'
    },
    {
        icon: Balloon,
        url: '/assets/stickers/balloon.svg'
    },
]

const StickersContainer = () => {
    return (
            <div className="grid grid-cols-3 gap-3">
                {
                    stickers.map(({ icon, url }, i) => <Sticker key={i} icon={icon} url={url} />)
                }
            </div>
    );
};

export default StickersContainer;