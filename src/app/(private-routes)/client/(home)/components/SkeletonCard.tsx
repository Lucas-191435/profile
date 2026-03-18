const SkeletonCard = () => {
    return (
        <div className="card-pokemon animate-pulse">
            <div className="flex justify-between items-start mb-2">
                <span className="bg-muted h-4 w-10 rounded"></span>
                <div className="flex gap-1">
                    <span className="bg-muted h-4 w-8 rounded-full"></span>
                    <span className="bg-muted h-4 w-8 rounded-full"></span>
                </div>
            </div>
            <div className="flex justify-center items-center py-4 h-48 sm:h-40 md:h-44 lg:h-28 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded mt-2 w-3/4 mx-auto"></div>
        </div>
    );
};

export default SkeletonCard;