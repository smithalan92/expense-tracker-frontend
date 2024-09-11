import { City as CityType } from "@/api.types";
import Modal from "@/components/Modals/ModalBase/Modal";
import ModalBody from "@/components/Modals/ModalBase/ModalBody";
import ModalHeader from "@/components/Modals/ModalBase/ModalHeader";
import City from "./City";

interface SelectedCitiesPopUpProps {
  selectedCities: Omit<CityType, "timezoneName">[];
  onClickCity: (cityId: number) => void;
  onClose: () => void;
}

export default function SelectedCitiesPopUp({
  selectedCities,
  onClickCity,
  onClose,
}: SelectedCitiesPopUpProps) {
  return (
    <Modal width={300}>
      <ModalHeader
        title="Selected Cities"
        includeCloseButton={true}
        onClickClose={onClose}
      />
      <ModalBody height={400}>
        <div className="py-4 w-full">
          {selectedCities.length === 0 && (
            <span className="text-center">No cities have been selected.</span>
          )}
          {selectedCities.map((city) => {
            return (
              <City
                key={city.id}
                city={city}
                isSelected={true}
                onClick={onClickCity}
              />
            );
          })}
        </div>
      </ModalBody>
    </Modal>
  );
}
