import { fixImagePath } from "./utils/imageUtils";

const Pizza = (props) => {
  return (
    <div className="pizza">
      <h1>{props.name}</h1>
      <p>{props.description}</p>
      <img src={fixImagePath(props.image)} alt={props.name} />
    </div>
  );
};

export default Pizza;
