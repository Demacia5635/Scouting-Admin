type ButtonProps = {
    handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
} & React.ComponentProps<'button'>

export const Button = ({ handleClick, children, ...props }: ButtonProps) => {
    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (handleClick) handleClick(event)
    }

    return (
        <button onClick={onClick} {...props}>
            {children}
        </button>
    )
}