import React from "react";
import { Route, Routes } from "react-router-dom";
import { links } from "../../data/links";

function RoutesComponent() {
  return (
    <Routes>
      {links?.map((item) =>
        item?.subRoutes && item?.subRoutes?.length ? (
          <Route key={item.route} path={item.route}>
            {item?.subRoutes?.map((subRoute, index) => (
              <Route
                key={`${item.route}-${index}`}
                path={subRoute?.route}
                element={<subRoute.component />}
              />
            ))}
          </Route>
        ) : (
          <Route
            key={item.route}
            path={item.route}
            element={<item.component />}
          />
        )
      )}
    </Routes>
  );
}

export default RoutesComponent;
