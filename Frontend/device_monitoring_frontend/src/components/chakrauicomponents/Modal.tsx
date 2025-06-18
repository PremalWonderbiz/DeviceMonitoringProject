import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"

const Modal = ({children, triggerButton, title} : any) => {
  return (
    <Dialog.Root closeOnInteractOutside={false} modal={false} placement={"center"} size="md">
      <Dialog.Trigger asChild>
        {triggerButton ? triggerButton : <Button variant="outline">Open Modal</Button>}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop>
        <Dialog.Positioner pointerEvents="none">
          <Dialog.Content padding={"1rem 1.5rem"} color={"#fff"} backgroundColor={"#181818"}>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body padding={"1rem 0"}>
              {children}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button padding={"0.5rem 1rem"} variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button  padding={"0.5rem 1rem"}>Save</Button>
            </Dialog.Footer>
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