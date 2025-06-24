import { useState } from "react"
import {
  Button,
  CloseButton,
  Dialog,
  Portal
} from "@chakra-ui/react"
import ComboBox from "./ComboBox"
import { DateRangePicker } from "rsuite"

const Modal = ({ setDateRange, triggerButton, title, devices, selectedDevices, setSelectedDevices }: any) => {
  const [tempSelectedDevices, setTempSelectedDevices] = useState<any[]>([])
  const [tempDateRange, setTempDateRange] = useState<[Date, Date] | null>(null);
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setTempSelectedDevices(selectedDevices)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleSave = () => {
    setSelectedDevices(tempSelectedDevices)
    setDateRange(tempDateRange)
    handleClose()
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
      closeOnInteractOutside={false}
      modal={false}
      placement="center"
      size="md"
    >
      <Dialog.Trigger asChild>
        <div onClick={handleOpen}>
          {triggerButton ?? <Button variant="outline">Open Modal</Button>}
        </div>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop>
          <Dialog.Positioner >
            <Dialog.Content
              padding="1rem 1.5rem"
              color="#fff"
              backgroundColor="#181818"
            >
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body padding="1rem 0">
                <ComboBox
                  devices={devices}
                  selectedDevices={tempSelectedDevices}
                  setSelectedDevices={setTempSelectedDevices}
                />
                <br />

                <DateRangePicker value={tempDateRange} onChange={(value) => {setTempDateRange(value)}} placeholder="Select Date Range" placement="topEnd" />

              </Dialog.Body>

              <Dialog.Footer>
                <Button
                  padding="0.5rem 1rem"
                  variant="outline"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button padding="0.5rem 1rem" onClick={handleSave}>
                  Save
                </Button>
              </Dialog.Footer>

              {/* Only ONE CloseTrigger — used for CloseButton (X) */}
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Backdrop>
      </Portal>
    </Dialog.Root>
  )
}

export default Modal
