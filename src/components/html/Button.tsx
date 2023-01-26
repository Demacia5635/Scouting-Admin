type ButtonProps = {
    handleClick: (event2: React.MouseEvent<HTMLButtonElement>, id: number) => void
} & React.ComponentProps<'button'>

export const Button = ({ handleClick, children, ...props }: ButtonProps) => {
    return (
        <button onClick={event => handleClick(event, 1)}>{children}</button>
    )
}