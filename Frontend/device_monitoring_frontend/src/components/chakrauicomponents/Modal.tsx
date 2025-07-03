import {
  Button,
  CloseButton,
  Dialog,
  Portal
} from "@chakra-ui/react"


const Modal = ({ containerRef, isOpen, setIsOpen, triggerButton, content, title, footer=true }: any) => {

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
      modal={false}
      placement="center"
      size="xs"
      closeOnInteractOutside={false}
      
    >
      <Dialog.Trigger asChild>
        <div>
          {triggerButton ?? <Button variant="outline">Open Modal</Button>}
        </div>
      </Dialog.Trigger>

      <Portal>
          <Dialog.Positioner>
            <Dialog.Content
              padding="0.5rem 1rem"
              color="#fff"
              backgroundColor="#262626"
              boxShadow={"none"}
              width={"250px"}
            >
              <Dialog.Header>
                <Dialog.Title fontSize={"16px"}>{title}</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body padding="0.5rem 0">
                {content}
              </Dialog.Body>

              {footer && <Dialog.Footer>
                <Button
                  padding="0.4rem 1rem"
                  colorPalette={"gray"}
                  variant={"surface"}
                  onClick={handleClose}
                  height={"auto"}
                >
                  Cancel
                </Button>
                <Button padding="0.4rem 1rem" height={"auto"} >
                  Save
                </Button>
              </Dialog.Footer>}

              {/* Only ONE CloseTrigger — used for CloseButton (X) */}
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
       </Portal>
    </Dialog.Root>
  )
}

export default Modal
