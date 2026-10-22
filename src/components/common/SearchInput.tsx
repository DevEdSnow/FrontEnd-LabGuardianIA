import {
  forwardRef,
  useId,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { LoaderCircle, Search, SlidersHorizontal, X } from "lucide-react";

export type SearchInputSize = "sm" | "md" | "lg";
export type SearchInputVariant = "default" | "filled";

interface SearchInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "value" | "defaultValue" | "onChange"
  > {
  size?: SearchInputSize;
  variant?: SearchInputVariant;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  showClearButton?: boolean;
  showSearchButton?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  searchButtonLabel?: string;
  containerClassName?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      size = "md",
      variant = "default",
      value,
      defaultValue = "",
      onChange,
      onSearch,
      placeholder = "Buscar...",
      showClearButton = true,
      showSearchButton = false,
      loading = false,
      leftIcon,
      rightIcon,
      searchButtonLabel = "Buscar",
      containerClassName = "",
      className = "",
      disabled = false,
      onKeyDown,
      onFocus,
      onBlur,
      id,
      type: _type,
      ...inputProps
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [internalValue, setInternalValue] = useState(defaultValue);

    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = currentValue.length > 0;
    const isDisabled = disabled || loading;

    const handleChange = (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }

      onChange?.(nextValue);
    };

    const handleClear = () => {
      if (isDisabled) return;

      handleChange("");
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!isDisabled) {
        onSearch?.(currentValue.trim());
      }
    };

    const content = (
      <>
        <span className="search-input__left-icon" aria-hidden="true">
          {leftIcon ?? <Search size={size === "sm" ? 16 : size === "lg" ? 22 : 19} />}
        </span>

        <input
          {...inputProps}
          ref={ref}
          id={inputId}
          type="search"
          className={["search-input__input", className].filter(Boolean).join(" ")}
          placeholder={placeholder}
          value={currentValue}
          disabled={isDisabled}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete={inputProps.autoComplete ?? "off"}
        />

        {loading ? (
          <span className="search-input__right-icon search-input__loading" aria-hidden="true">
            <LoaderCircle size={18} />
          </span>
        ) : hasValue && showClearButton && !isDisabled ? (
          <button
            type="button"
            className="search-input__clear"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
            title="Limpiar"
          >
            <X size={17} />
          </button>
        ) : rightIcon ? (
          <span className="search-input__right-icon" aria-hidden="true">
            {rightIcon}
          </span>
        ) : showSearchButton ? (
          <button
            type="submit"
            className="search-input__submit"
            disabled={isDisabled}
            aria-label={searchButtonLabel}
            title={searchButtonLabel}
          >
            <Search size={17} />
          </button>
        ) : null}
      </>
    );

    const wrapperClassName = [
      "search-input",
      `search-input--${size}`,
      `search-input--${variant}`,
      isDisabled ? "search-input--disabled" : "",
      loading ? "search-input--loading" : "",
      containerClassName,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <form className="search-input__form" role="search" onSubmit={handleSubmit}>
        <div className={wrapperClassName}>
          {content}
        </div>
      </form>
    );
  },
);

SearchInput.displayName = "SearchInput";

export default SearchInput;