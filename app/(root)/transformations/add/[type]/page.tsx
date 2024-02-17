import Header from "@/components/shared/Header";
import { transformationTypes } from "@/constants"; 

const AddTransformationTypePage = ({ params: { type } }:
  SearchParamProps) => {
    const transformation = transformationTypes[type];
  return (
   <Header 
     title={transformation.title}
     subtitle={transformation.subTitle}
   />
  );
}

export default AddTransformationTypePage;
