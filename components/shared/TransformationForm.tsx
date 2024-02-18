"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, defaultValues, transformationTypes } from "@/constants"
import { AspectRatioKey, dataUrl, debounce, deepMergeObjects } from "@/lib/utils"
import { CustomField } from "./CustomField"
import { useState, useTransition } from "react"
import { set } from "mongoose"
import MediaUploader from "./MediaUploader"
import TransformedImage from "./TransformedImage"
import { updateCredits } from "@/lib/actions/user.actions"
 
export const formSchema = z.object({
    title: z.string(),
    aspectRatio: z.string().optional(),
    color: z.string().optional(),
    prompt: z.string().optional(),
    publicId: z.string(),
})

const TransformationForm = ({ action, data = null,
userId, type, creditBalance, config = null }: TransformationFormProps) => {
        const transformationType = transformationTypes[type];
        const [image, setImage] = useState(data)
        const [newTransformation, setNewTransformation] = 
        useState<Transformations | null>(null);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [isTransforming, setIsTransforming] = useState(false);
        const [transformationConfig, setTransformationConfig] = 
        useState(config);
        const [isPending, startTransition] = useTransition();

        const initialValues = data && action  === 'Update' ? {
                title: data?.title,
                aspectRatio: data?.aspectRatio,
                color: data?.color,
                prompt: data?.prompt,
                publicId: data?.publicId,
        } : defaultValues

         // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
    })
 
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    const onSelectFieldHandler = ( value: string,
        onChangeField :(value: string) => void) => {
            const imageSize = aspectRatioOptions[value as
            AspectRatioKey]

            setImage((prevState: any) => ({
                ...prevState,
                aspectRatio: imageSize.aspectRatio,
                height: imageSize.height,
            }))

            setNewTransformation(transformationType.config)

            return onChangeField(value)
        }


    const onInputChangeHandler = (fieldName: string,
        value: string, type: string, 
        onChangeField: (value: string) => void) => {
            debounce(() => {
              setNewTransformation((prevState: any) => ({
                ...prevState,
                [type]: {
                    ...prevState?.[type],
                    [fieldName === 'prompt' ? 'prompt' : 'to']: value
                }
              }))

              return onChangeField(value)
            }, 1000);
        }
//TODO: Update creditFee to something more descriptive
    const onTransformHandler = async () => {
        setIsTransforming(true);
        setTransformationConfig(
            deepMergeObjects(newTransformation,
                transformationConfig)
        )
        setNewTransformation(null);
        startTransition(async () => {
            await updateCredits(userId, -1)
        })
    }
    return (
     <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CustomField 
                control={form.control}
                name="title"
                formLabel= "Image Title"
                className="w-full"
                render={({ field }) => <Input {...field}
                className="input-field" /> }
            />

            {type === 'fill' && (
                <CustomField 
                     control={form.control}
                     name="aspectRatio"
                     formLabel="Aspect Ratio"
                     className="w-full"
                     render={({ field}) => (
                    <Select
                      onValueChange={(value) =>
                      onSelectFieldHandler(value, field.
                        onChange)}
                    >
                         <SelectTrigger className="select-field">
                            <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                         <SelectContent>
                            {Object.keys(aspectRatioOptions).map((key) => (
                                <SelectItem key={key} value={key}
                                 className="select-item"
                                >
                                    {aspectRatioOptions[key as
                                    AspectRatioKey].label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                     )}
                />
            )}

            {(type === 'remove' || type === 'recolor') && (
                <div className="prompt-field">
                    <CustomField 
                       control={form.control} 
                       name="prompt"
                       formLabel={
                        type === 'remove' ? 'Object to remove' : 
                        'Object to recolor'
                       }
                       className="w-full"
                       render={(({ field }) => (
                           <Input
                             value={field.value}
                             className="input-field"
                             onChange={(e) => onInputChangeHandler(
                                'prompt', 
                                 e.target.value,
                                 type,
                                 field.onChange
                             )}
                           />
                       ))}
                    />

                    {type === 'recolor' && (
                        <CustomField 
                           control={form.control}
                           name="color"
                           formLabel="Replacement Color"
                           className="w-full"
                           render={({ field }) => (
                              <Input 
                              value={field.value}
                              className="input-field"
                              onChange={(e) => onInputChangeHandler(
                                 'color', 
                                  e.target.value,
                                  'recolor',
                                  field.onChange
                              )}
                              />
                           )}
                        />
                    )}
                </div>
            )}

            <div className="media-uploader-field">
                <CustomField 
                   control={form.control}
                   name="publicId"
                   className="flex size-full flex-col"
                   render={({ field }) => (
                    <MediaUploader
                       onValueChange={field.onChange}
                       setImage={setImage}
                       publicId={field.value}
                       image={image}
                       type={type}
                     />
                   )}
                />

                <TransformedImage
                    image={image}
                    type={type}
                    title={form.getValues().title}
                    isTransforming={isTransforming}
                    setIsTransforming={setIsTransforming}
                    transformationConfig={transformationConfig}
                 />
            </div>

            <div className="flex flex-col gap-4">
             <Button 
              type="button"
              className="submit-button capitalize"
              disabled={isTransforming || newTransformation
                === null}
              >{isTransforming ? 'Transforming...' :
              'Apply Transformation'}
             </Button>
             <Button 
              type="submit"
              className="submit-button capitalize"
              disabled={isSubmitting}
              onClick={onTransformHandler}
              >{isSubmitting ? 'Submitting...' : 
              'Save Image'}
             </Button>
            </div>
            
        </form>
    </Form>
    );
}

export default TransformationForm;
