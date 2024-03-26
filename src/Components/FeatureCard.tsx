import React, { HTMLAttributes, ReactNode, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge';
interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {
    featureIcon: ReactNode;
    featureTitle: string;
    featureDescription: string | ReactNode;
    classNames?: {
        base?: string,
        iconWrapper?: string,
        title?: string,
        desc?: string
    };
}
// 
const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(({ className, classNames, featureDescription, featureIcon, featureTitle, ...props }, ref) => {
    return (
        <React.Fragment>
            <div ref={ref} {...props} className={twMerge("flex flex-col p-3 justify-start items-center  bg-gradient-to-t dark:bg-gradient-to-b from-white to-pink-200 dark:from-violet-950 dark:to-purple-900 rounded-large shadow-2xl shadow-black/20", className, classNames?.base)}>
                <div className={twMerge("flex justify-center items-center h-fit", classNames?.iconWrapper)}>
                    {featureIcon}
                </div>
                <h1 className={twMerge("text-md font-diaryTitle md:text-3xl font-bold text-diaryAccentText dark:text-diarySecondaryText", classNames?.title)}>{featureTitle}</h1>
                <div className={twMerge("text-tiny md:text-medium p-3 w-full text-justify font-diaryNunito", classNames?.desc)}>{featureDescription}</div>
            </div>
        </React.Fragment>
    )
})


export default FeatureCard