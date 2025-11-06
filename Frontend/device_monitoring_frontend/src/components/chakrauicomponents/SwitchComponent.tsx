import { Switch } from "@chakra-ui/react"
import { HiCheck, HiX } from "react-icons/hi"
import { Tooltip } from "../ui/tooltip"

interface SwitchComponentProps {
  enabled: boolean
  tooltip?: string
  toggle: () => void
}

const SwitchComponent = (props: SwitchComponentProps) => {

  function returnSwitch() {
    return (
      <Switch.Root checked={props.enabled} colorPalette={"green"} size="md">
        <Switch.HiddenInput />
        <Switch.Control onClick={props.toggle}>
          <Switch.Thumb>
            <Switch.ThumbIndicator fallback={<HiX color="black" />}>
              <HiCheck />
            </Switch.ThumbIndicator>
          </Switch.Thumb>
        </Switch.Control>
      </Switch.Root>
    )
  }

  function renderSwitchContent() {
    if (props.tooltip && props.tooltip.length > 0) {
      return (
        <Tooltip openDelay={100} closeDelay={150} content={<span className="p-2">{props.tooltip}</span>}>
          <div>
            {returnSwitch()}
          </div>
        </Tooltip>
      )
    }
    else {
      return returnSwitch();
    }
  }


  return (
    renderSwitchContent()
  )
}

export default SwitchComponent;