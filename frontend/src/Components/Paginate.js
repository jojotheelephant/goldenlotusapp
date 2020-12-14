import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({
    pages,
    page,
    count,
    keyword = "",
    pageSize,
    routePrefix = "",
    pageNumber = "",
}) => {
    const itemCountStart = () => {
        return pageSize * page + 1 - pageSize;
    };

    const itemCountEnd = () => {
        return pageSize * page > count ? count : pageSize * page;
    };

    const linkLocation = (counter) => {
        // for searched page navagation non-homescreen pages
        if (routePrefix && keyword) {
            return `${routePrefix}/search/${keyword}/page/${counter + 1}`;
        }
        // for unsearched page navagation non-homescreen pages
        if (routePrefix) {
            return `${routePrefix}/page/${counter + 1}`;
        }
        // for searched page navagation homescreen
        if (keyword) {
            return `/search/${keyword}/page/${counter + 1}`;
        }
        // for unsearched page navagation homescreen
        return `/page/${counter + 1}`;
    };

    return (
        pages > 1 && (
            <>
                <Pagination>
                    {[...Array(pages).keys()].map((counter) => (
                        <LinkContainer
                            key={counter + 1}
                            to={linkLocation(counter)}
                        >
                            <Pagination.Item active={counter + 1 === page}>
                                {counter + 1}
                            </Pagination.Item>
                        </LinkContainer>
                    ))}
                </Pagination>
                <p>
                    Showing {itemCountStart()} - {itemCountEnd()} of {count}
                </p>
            </>
        )
    );
};

export default Paginate;
