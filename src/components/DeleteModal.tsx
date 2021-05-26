import * as React from "react";
import { Dialog, Transition } from "@headlessui/react";
import tw from "tailwind-styled-components";

export interface DeleteModalProps {}

export interface DeleteModalState {
  isOpen: boolean;
}

class DeleteModal extends React.Component<DeleteModalProps, DeleteModalState> {
  cancelButtonRef = React.createRef<any>();

  constructor(props: DeleteModalProps) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  componentDidMount() {
    this.setState({ isOpen: true });
  }

  componentDidUpdate() {}

  openModal = () => {
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <>
        <Transition appear show={this.state.isOpen} as={React.Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={this.closeModal}
          >
            <div className="min-h-screen px-4 text-center">
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60" />

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <DialogContainer>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 "
                >
                  Confirm Deletion
                </Dialog.Title>
                <Dialog.Description className="mt-2">
                  <p className="text-sm text-gray-300">
                    Are you sure you want to delete this?
                  </p>
                </Dialog.Description>

                <div className="mt-4 flex justify-end gap-3">
                  <CancelBtn type="button" onClick={this.closeModal}>
                    Cancel
                  </CancelBtn>
                  <ConfirmBtn type="button" onClick={this.closeModal}>
                    Delete
                  </ConfirmBtn>
                </div>
              </DialogContainer>
              {/* </Transition.Child> */}
            </div>
          </Dialog>
        </Transition>
      </>
    );
  }
}

export default DeleteModal;

const DialogContainer = tw.div`
inline-block 
w-full 
max-w-md 
p-6 
my-8 
overflow-hidden 
text-left 
align-middle 
transition-all 
transform 
bg-black
shadow-xl 
rounded-2xl 
border-2
border-white 
border-opacity-20
text-white
`;

const ButtonBase = tw.button`
  inline-flex
  justify-center
  px-4 
  py-2 
  text-sm 
  font-medium 
`;

const CancelBtn = tw(ButtonBase)`
  text-white
  bg-white
  bg-opacity-20

  border 
  border-transparent 
  rounded 
  hover:bg-white
  hover:bg-opacity-30
  focus:outline-none 
  focus-visible:ring-2 
  focus-visible:ring-offset-2 
  focus-visible:ring-blue-500
`;

const ConfirmBtn = tw(ButtonBase)`
  text-white 
  bg-red-600 

  border 
  border-transparent 
  rounded 
  hover:bg-red-500 
  focus:outline-none 
  focus-visible:ring-2 
  focus-visible:ring-offset-2 
  focus-visible:ring-blue-500
`;
