const SkeletonCard = () => {
    return (
        <div className="card-pokemon animate-pulse">
            <span className="block bg-muted h-4 w-10 rounded"></span>
            <div className="flex justify-center items-center py-4 h-48 sm:h-40 md:h-44 lg:h-28 bg-muted rounded mt-2"></div>
            <div className="h-4 bg-muted rounded mt-2 w-3/4 mx-auto"></div>
            <div className="flex justify-center gap-1.5 mt-2">
                <span className="bg-muted h-5 w-14 rounded-full"></span>
                <span className="bg-muted h-5 w-14 rounded-full"></span>
            </div>
        </div>
    );
};

export default SkeletonCard;
