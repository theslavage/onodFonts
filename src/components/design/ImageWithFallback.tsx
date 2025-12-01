import React, {
  useState,
  useEffect,
  type ImgHTMLAttributes,
  type FC,
} from "react";

const DEFAULT_ERROR_IMG_SRC =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

export interface ImageWithFallbackProps
    extends ImgHTMLAttributes<HTMLImageElement> {

  fallbackSrc?: string;
}

export const ImageWithFallback: FC<ImageWithFallbackProps> = (props) => {
  const {
    src,
    alt,
    className,
    style,
    fallbackSrc,
    onError,
    ...rest
  } = props;

  const [didError, setDidError] = useState(false);

  useEffect(() => {
    setDidError(false);
  }, [src]);

  const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
    setDidError(true);
    if (onError) {
      onError(event);
    }
  };

  if (didError) {
    const fallback = fallbackSrc ?? DEFAULT_ERROR_IMG_SRC;

    return (
        <div
            className={`inline-block bg-gray-100 text-center align-middle ${
                className ?? ""
            }`}
            style={style}
            aria-label={alt || "Image failed to load"}
        >
          <div className="flex items-center justify-center w-full h-full">
            <img
                src={fallback}
                alt={alt || "Error loading image"}
                data-original-url={src}
                {...rest}
            />
          </div>
        </div>
    );
  }

  return (
      <img
          src={src}
          alt={alt ?? ""}
          className={className}
          style={style}
          onError={handleError}
          {...rest}
      />
  );
};
