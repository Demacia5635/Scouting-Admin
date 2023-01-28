import { SeasonButtonProps } from "../components/types/Season"

export function movedToSeasonEditor(props: SeasonButtonProps) {
    sessionStorage.setItem('seasonYear', props.year)
    sessionStorage.setItem('seasonName', props.name)
}