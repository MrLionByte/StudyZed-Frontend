import { useLocation, Link } from "react-router-dom"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import React from "react";

export const DynamicBreadcrumb = ({routes}) => {

  const location = useLocation()
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathnames.map((_, index) => {
          const url = `/${pathnames.slice(0, index + 1).join("/")}`;
          const matchedRoute = routes.find((route) => route.path === url);

          if (!matchedRoute) return null;

          const isLast = index === pathnames.length - 1;

          return (
            <React.Fragment key={url}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{matchedRoute.breadcrumb}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink as={Link} to={url}>
                    {matchedRoute.breadcrumb}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
};

  
