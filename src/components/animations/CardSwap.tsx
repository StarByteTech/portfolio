import React, {
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    ReactElement,
    ReactNode,
    RefObject,
    useEffect,
    useMemo,
    useRef
} from 'react';
import gsap from 'gsap';

export interface CardSwapProps {
    width?: number | string;
    height?: number | string;
    cardDistance?: number;
    verticalDistance?: number;
    delay?: number;
    pauseOnHover?: boolean;
    onCardClick?: (idx: number) => void;
    bringCardForwardOnHover?: boolean;
    skewAmount?: number;
    easing?: 'linear' | 'elastic';
    children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
    <div
        ref={ref}
        {...rest}
        className={`absolute top-1/2 left-1/2 rounded-xl border border-white bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
    />
));
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
    x: number;
    y: number;
    z: number;
    zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
    x: i * distX,
    y: -i * distY,
    z: -i * distX * 1.5,
    zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
    gsap.set(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        xPercent: -50,
        yPercent: -50,
        skewY: skew,
        transformOrigin: 'center center',
        zIndex: slot.zIndex,
        force3D: true
    });

const CardSwap: React.FC<CardSwapProps> = ({
    width = 500,
    height = 400,
    cardDistance = 60,
    verticalDistance = 70,
    delay = 5000,
    pauseOnHover = false,
    onCardClick,
    bringCardForwardOnHover = false,
    skewAmount = 6,
    easing = 'elastic',
    children
}) => {
    const config =
        easing === 'elastic'
            ? {
                ease: 'elastic.out(0.6,0.9)',
                durDrop: 2,
                durMove: 2,
                durReturn: 2,
                promoteOverlap: 0.9,
                returnDelay: 0.05
            }
            : {
                ease: 'power1.inOut',
                durDrop: 0.8,
                durMove: 0.8,
                durReturn: 0.8,
                promoteOverlap: 0.45,
                returnDelay: 0.2
            };

    const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
    const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr.length]);

    const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));

    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const intervalRef = useRef<number>(0);
    const container = useRef<HTMLDivElement>(null);
    const hoveredCardRef = useRef<number | null>(null);
    const isAnimatingRef = useRef<boolean>(false);

    // Extract swap function to be reusable
    const swap = React.useCallback(() => {
        if (order.current.length < 2 || hoveredCardRef.current !== null) return;

        const [front, ...rest] = order.current;
        const elFront = refs[front].current!;
        const tl = gsap.timeline();
        tlRef.current = tl;

        tl.to(elFront, {
            y: '+=500',
            duration: config.durDrop,
            ease: config.ease
        });

        tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
        rest.forEach((idx, i) => {
            const el = refs[idx].current!;
            const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
            tl.set(el, { zIndex: slot.zIndex }, 'promote');
            tl.to(
                el,
                {
                    x: slot.x,
                    y: slot.y,
                    z: slot.z,
                    duration: config.durMove,
                    ease: config.ease
                },
                `promote+=${i * 0.15}`
            );
        });

        const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
        tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
        tl.call(
            () => {
                gsap.set(elFront, { zIndex: backSlot.zIndex });
            },
            undefined,
            'return'
        );
        tl.to(
            elFront,
            {
                x: backSlot.x,
                y: backSlot.y,
                z: backSlot.z,
                duration: config.durReturn,
                ease: config.ease
            },
            'return'
        );

        tl.call(() => {
            order.current = [...rest, front];
        });
    }, [refs, cardDistance, verticalDistance, config]);

    useEffect(() => {
        const total = refs.length;
        refs.forEach((r, i) => placeNow(r.current!, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

        swap();
        intervalRef.current = window.setInterval(swap, delay);

        if (pauseOnHover && !bringCardForwardOnHover) {
            const node = container.current!;
            const pause = () => {
                tlRef.current?.pause();
                clearInterval(intervalRef.current);
            };
            const resume = () => {
                tlRef.current?.play();
                intervalRef.current = window.setInterval(swap, delay);
            };
            node.addEventListener('mouseenter', pause);
            node.addEventListener('mouseleave', resume);
            return () => {
                node.removeEventListener('mouseenter', pause);
                node.removeEventListener('mouseleave', resume);
                clearInterval(intervalRef.current);
            };
        }
        return () => clearInterval(intervalRef.current);
    }, [cardDistance, verticalDistance, delay, pauseOnHover, bringCardForwardOnHover, skewAmount, swap]);

    const handleCardHover = React.useCallback((cardIndex: number) => {
        if (!bringCardForwardOnHover || isAnimatingRef.current) return;
        
        const cardPosition = order.current.indexOf(cardIndex);
        
        // Store the hovered card
        hoveredCardRef.current = cardIndex;
        
        // If already at front, just pause the automatic swapping
        if (cardPosition === 0) {
            tlRef.current?.pause();
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }
        
        // Pause any ongoing animations and intervals
        isAnimatingRef.current = true;
        tlRef.current?.pause();
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        // Create animation to bring this card forward
        const total = refs.length;
        const el = refs[cardIndex].current!;
        const tl = gsap.timeline({
            onComplete: () => {
                isAnimatingRef.current = false;
            }
        });
        tlRef.current = tl;
        
        // Rearrange order first
        const newOrder = [cardIndex, ...order.current.filter(idx => idx !== cardIndex)];
        
        // Animate all cards to their new positions
        newOrder.forEach((idx, i) => {
            const cardEl = refs[idx].current!;
            const slot = makeSlot(i, cardDistance, verticalDistance, total);
            tl.to(cardEl, {
                x: slot.x,
                y: slot.y,
                z: slot.z,
                zIndex: slot.zIndex,
                duration: config.durMove * 0.5,
                ease: 'power2.out'
            }, 0); // All cards animate together
        });
        
        // Update order after animation
        tl.call(() => {
            order.current = newOrder;
        });
    }, [bringCardForwardOnHover, refs, cardDistance, verticalDistance, config]);

    const handleCardLeave = React.useCallback((cardIndex: number) => {
        if (!bringCardForwardOnHover) return;
        
        // Clear the hovered card reference
        hoveredCardRef.current = null;
        
        // Wait a bit before resuming to ensure user has left the card area
        setTimeout(() => {
            // Only resume if no card is being hovered
            if (hoveredCardRef.current === null && !isAnimatingRef.current) {
                intervalRef.current = window.setInterval(swap, delay);
            }
        }, 100);
    }, [bringCardForwardOnHover, swap, delay]);

    const rendered = childArr.map((child, i) =>
        isValidElement<CardProps>(child)
            ? cloneElement(child, {
                key: i,
                ref: refs[i],
                style: { width, height, ...(child.props.style ?? {}) },
                onClick: e => {
                    child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
                    onCardClick?.(i);
                },
                onMouseEnter: bringCardForwardOnHover ? () => handleCardHover(i) : undefined,
                onMouseLeave: bringCardForwardOnHover ? () => handleCardLeave(i) : undefined
            } as CardProps & React.RefAttributes<HTMLDivElement>)
            : child
    );

    return (
        <div
            ref={container}
            className="absolute bottom-0 right-0 transform 
            translate-x-[20%] translate-y-[15%] scale-[0.65] origin-bottom-right perspective-[900px] overflow-visible
            sm:translate-x-[15%] sm:translate-y-[18%] sm:scale-[0.75]
            md:translate-x-[12%] md:translate-y-[20%] md:scale-[0.85]
            lg:translate-x-[8%] lg:translate-y-[20%] lg:scale-[0.95]
            xl:translate-x-[5%] xl:translate-y-[20%] xl:scale-[1]"
            style={{ width, height }}
        >
            {rendered}
        </div>
    );
};

export default CardSwap;
