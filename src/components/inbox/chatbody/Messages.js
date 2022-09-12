import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { messagesApi } from "../../../features/messages/messagesApi";
import Message from "./Message";

export default function Messages({ messages = [], totalCount, id }) {
    const { user } = useSelector((state) => state.auth) || {};
    const { email } = user || {};

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const dispatch = useDispatch();

    const fetchMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        if (page > 1) {
            dispatch(
                messagesApi.endpoints.getMoreMessages.initiate({
                    id,
                    page,
                })
            );
        }
    }, [page, id, dispatch]);

    useEffect(() => {
        if (totalCount > 0) {
            const more =
                Math.ceil(
                    totalCount /
                        Number(process.env.REACT_APP_CONVERSATIONS_PER_PAGE)
                ) > page;

            setHasMore(more);
        }
    }, [totalCount, page]);

    return (
            <div 
                id="scrollableDiv"
                className="relative w-full h-[calc(100vh_-_197px)] p-6 overflow-y-auto flex flex-col-reverse"  
                style={{
                    height: window.innerHeight - 280,
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                }}
            >
                <InfiniteScroll
                    dataLength={messages.length}
                    next={fetchMore}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    // height={window.innerHeight - 197}
                    style={{ display: 'flex', flexDirection: 'column-reverse' }}
                    inverse={true}
                    scrollableTarget="scrollableDiv"
                >
                    <ul className="space-y-2">
                            {
                                messages
                                    .slice()
                                    .sort((a, b) => a.timestamp - b.timestamp)
                                    .map((message) => {
                                        const {
                                            message: lastMessage,
                                            id,
                                            sender,
                                        } = message || {};

                                        const justify =
                                            sender.email !== email ? "start" : "end";

                                        return (
                                            <Message
                                                key={id}
                                                justify={justify}
                                                message={lastMessage}
                                            />
                                        );
                                })
                            }
                        
                    </ul>
                
                </InfiniteScroll>
            </div>
    );
}
