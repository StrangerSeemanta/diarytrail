import { Button, ButtonGroup, Flex, FormControl, FormHelperText, FormLabel, Textarea, useToast } from '@chakra-ui/react'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { updateUserDetailsField } from '../Modules/UserDetailsDB';
import { User } from 'firebase/auth';
interface BioFormProps {
    currentUser: User,
    onCancel: () => void;
}
function BioForm({ currentUser, onCancel }: BioFormProps) {
    const [isInvalid, setInvalid] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [textVal, setTextVal] = useState<string>('');
    const toast = useToast({ position: "bottom-right", isClosable: false })
    const handleValueChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setTextVal(e.target.value);
        if (e.target.value && e.target.value.length <= 101) {
            setInvalid(false)
        } else {
            setInvalid(true)
        }
    }
    const handleUpdateBio = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isInvalid) {
            setLoading(true);
            updateUserDetailsField(currentUser, {
                fieldName: "bio",
                newValue: textVal
            }).then(() => {
                setLoading(false);
                toast({
                    status: "success",
                    title: "Your Bio Updated"
                });
                onCancel()
            }).catch((e) => {
                setLoading(false);
                toast({
                    status: "error",
                    title: "Failed To Update Bio"
                })
                console.log(e)
            })
        }
    }
    return (
        <React.Fragment>
            <form onSubmit={handleUpdateBio} className='w-80'>
                <FormControl fontFamily={"inherit"}>

                    <FormLabel>
                        Write Down Your Bio Here.{" "}

                    </FormLabel>
                    <Textarea textAlign={"center"} isRequired name='bio' minH={"120px"} onInvalid={() => setInvalid(true)} value={textVal} onChange={handleValueChange} isInvalid={isInvalid} resize={"none"} />
                    <Flex mt={2} justifyContent="space-between">
                        <FormHelperText color={isInvalid ? "red" : "green"}> {textVal.length} / 101 characters</FormHelperText>

                        <ButtonGroup>
                            <Button onClick={onCancel} size="sm">
                                Cancel
                            </Button>
                            <Button isLoading={isLoading} colorScheme='orange' type='submit' size={"sm"}>Save</Button>
                        </ButtonGroup>
                    </Flex>
                </FormControl>
            </form>
        </React.Fragment>
    )
}

export default BioForm