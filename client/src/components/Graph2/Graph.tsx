import { useContext } from "react";
import { useSelector } from "react-redux";
import { AppContext } from "../../AppContext";
import { RootState } from "../../store";
import Loading from "../Loading";
import { Modal } from "./Modal";

export const Graph = () => {
  const { theme } = useContext(AppContext);

  const isModalOpen = useSelector<RootState, boolean>((state) => state.modalHandler.value);

  return (
    <div className="flex w-full h-full px-2 sm:px-4 pb-2 sm:pb-4 pt-0">
      <div className="relative flex w-full h-full" style={{ ...theme.lowering }}>
        {isModalOpen && <Modal />}
        <Loading backgroundColor="transparent" color={theme.primary} />
      </div>
    </div>
  );
};