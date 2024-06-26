import { Box, Flex, Text, Avatar, VStack, Center, Spinner, Input, IconButton, } from "@chakra-ui/react";
import { HTMLAttributes, ReactNode, forwardRef, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserData_public, getAllUsers, getUserData_public } from "../Modules/Public_UserDataDB";
import { Conversation, getConversationForUser, listenToNewMessages } from "../Modules/ConversationsDB";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { base64Encode } from "../Modules/tokenize";
import { twMerge } from "tailwind-merge";
import { BiArrowBack } from "react-icons/bi";
import { IoHome } from "react-icons/io5";
interface inboxListItemProps extends HTMLAttributes<HTMLDivElement> {
    isActive: boolean;
    data: UserData_public;
    currentUserDetails: UserData_public;
}
const InboxListItem = forwardRef<HTMLDivElement, inboxListItemProps>(({ currentUserDetails, isActive, data, ...props }, ref) => {
    const [lastMsg, setLastMsg] = useState<Conversation["lastMessage"]>()
    const [isItMe, setIsItMe] = useState(false);
    useEffect(() => {
        if (lastMsg) {
            if (lastMsg.sender.displayName?.toLowerCase() === currentUserDetails?.displayName?.toLowerCase()) {
                setIsItMe(true)
            } else {
                setIsItMe(false);
            }
        } else {
            setIsItMe(false);
        }
    }, [currentUserDetails.displayName, lastMsg])
    useEffect(() => {
        const fetchLstMsg = async () => {
            await listenToNewMessages(currentUserDetails.dtid, data.dtid, (newMessage) => {
                if (lastMsg !== newMessage[newMessage.length - 1]) {
                    setLastMsg(newMessage[newMessage.length - 1]);

                }
            }, (err => console.error(err)));
        }
        fetchLstMsg()
    }, [currentUserDetails.dtid, data.dtid, lastMsg])
    return (
        <>
            <Flex ref={ref} as={Link} {...props} to={data.dtid} alignItems="start" mb={2} className={twMerge(" hover:brightness-95 cursor-pointer transition-all", !isActive ? "bg-gray-100" : "bg-gray-200 ")} p={3} w={"100%"} overflow={"hidden"}>
                <Avatar name={data.displayName || "User Account"} src={data.photoURL || undefined} size="md" mr={2} />
                <VStack alignItems={"start"} gap={1}>
                    <h1 className="text-lg font-bold">{data.displayName}</h1>
                    {lastMsg &&
                        <div className={twMerge("last-msg truncate w-48 text-sm", !isItMe ? "font-bold" : "font-normal")}>{isItMe ? "me" : lastMsg.sender.displayName}: {lastMsg.text}</div>
                    }
                </VStack>

            </Flex>
        </>
    )
})

interface MessagingUIProps {
    children: ReactNode
}
function MessagingUI({ children }: MessagingUIProps) {
    const [searchValue, setSearchValue] = useState('')
    const location = useLocation();
    const navigate = useNavigate();
    const [matchedUsers, setMatchedUsers] = useState<UserData_public[] | null>(null)
    const [totalusers, setTotalUsers] = useState<UserData_public[] | null>(null);
    const [conversations, setConversations] = useState<Conversation[] | null>([])
    const [isGettingUser, setGettingUser] = useState<boolean>(true);
    const [currentUserDetails, setCurrentUserDetails] = useState<UserData_public | null>(null)
    useEffect(() => {
        const auth = getAuth();
        setGettingUser(true)
        const updateUser = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDetails = await getUserData_public(base64Encode(user.uid));
                setCurrentUserDetails(userDetails);
                const conversations = await getConversationForUser(base64Encode(user.uid));
                console.log(conversations);
                conversations && setConversations(conversations);

                setGettingUser(false)
            } else {
                setCurrentUserDetails(null);
                setGettingUser(false)
            }
        })

        return () => updateUser();
    }, [])
    useEffect(() => {
        async function fetchData() {
            // You can await here
            const totalUsers = await getAllUsers();
            setTotalUsers(totalUsers);

            // ...
        }
        fetchData();


    }, [location.pathname]);
    const handleSearch = (value: string) => {
        if (!totalusers) {
            return
        }
        const matched = totalusers.filter((data) => {
            return data.displayName?.toLowerCase().includes(value.toLowerCase());
        })
        setMatchedUsers(matched)
    }
    return (
        <Flex
            direction="row"

            mx={"auto"}
            bg={"white"}
            className="shadow-customized rounded-2xl overflow-x-hidden h-screen w-full lg:h-[90vh] lg:w-[90%] "
        >
            {/* Inbox Sidebar */}
            <Box className="w-full border-r-2 border-diaryAccentText" display={location.pathname === "/messages" ? "block" : "none"} py={4} px={1} >
                <Flex px={2} justifyContent={"space-between"} alignItems={"center"} >
                    <Flex gap={3} mb={4} alignItems={"center"}  >
                        <IconButton onClick={() => navigate(-1)} bgColor="#4f4f4f" color={"white"} _hover={{ bgColor: "#1f1f1f" }} isRound size={"sm"} aria-label="back-btn">
                            <BiArrowBack size={19} />
                        </IconButton>
                        <IconButton onClick={() => navigate("/")} bgColor="red" color={"white"} _hover={{ bgColor: "darkred" }} isRound size={"sm"} aria-label="back-btn">
                            <IoHome size={18} />
                        </IconButton>
                        <Box className="flex justify-center items-center">
                            <Text className="h-full w-full" fontSize="xl" fontWeight="bold" >Inbox</Text>
                        </Box>
                    </Flex>
                    <Avatar size={"sm"} src={currentUserDetails?.photoURL || undefined} />
                </Flex>
                <Flex px={0}>
                    <Input isRequired borderRadius={"none"} type="search" variant={"filled"} colorScheme="teal" autoComplete="off" id="search_friends" value={searchValue} onChange={(e) => { setSearchValue(e.target.value); handleSearch(e.target.value) }} placeholder="Search Friends..." />
                </Flex>
                {searchValue ?
                    <Box my={4}>
                        <Text px={2} className="font-bold text-lg flex justify-between pr-3 items-center"><span>Matched Results:</span> <span>{matchedUsers ? matchedUsers.length : 0}</span></Text>
                        {
                            matchedUsers && currentUserDetails && matchedUsers.length > 0 ?
                                matchedUsers.map((user) => (
                                    <InboxListItem currentUserDetails={currentUserDetails}
                                        key={user.dtid} onClick={() => {
                                            setSearchValue('');
                                            setMatchedUsers(null)
                                        }} data={user} isActive={false} />
                                ))
                                :
                                <Text textAlign="center" my={4}>
                                    No matched results found.
                                </Text>
                        }
                    </Box>
                    :
                    <Box my={4}>
                        <Text px={2} className="font-bold text-lg">Conversations</Text>
                        {
                            !isGettingUser && currentUserDetails && conversations ? (
                                conversations.length > 0 ?
                                    <>
                                        <VStack alignItems={"start"} py={4} w={"100%"} gap={3}>
                                            {conversations.map((_conversationData, idx) => (

                                                <InboxListItem
                                                    currentUserDetails={currentUserDetails}
                                                    key={_conversationData.conversationId + String(idx)}
                                                    isActive={location.pathname.includes(`messages/${_conversationData.MetaData.receiver.dtid}`)}
                                                    data={_conversationData.MetaData.sender.dtid === currentUserDetails.dtid ? _conversationData.MetaData.receiver : _conversationData.MetaData.sender}
                                                />

                                            ))}
                                        </VStack>


                                    </> : <Text my={8}><Center>No Conversations</Center></Text>
                            ) :
                                <>
                                    <Center><Spinner color="coral" /></Center>
                                </>
                        }
                        {/* Add more users as needed */}
                    </Box>}
            </Box>
            {/* Messaging Section */}
            <div className={twMerge(" h-full w-full bg-transparent ", location.pathname === "/messages" ? "hidden" : "block")}>
                {children}
            </div>
        </Flex>
    )
}

export default MessagingUI;
