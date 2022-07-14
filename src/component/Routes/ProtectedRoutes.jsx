import { useSelector } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";

const ProtectedRoutes = ({element: Element, ...rest }) => {

    const navigate = useNavigate();

    const { loading, isAuthenticated, user } = useSelector(state => state.user);

    console.log(rest,Element);
    return (
        <>
            { !loading && (
                <Routes>
                    <Route
                        {...rest}
                        render={(props) => {
                            console.log(...props);
                            if (!isAuthenticated) {
                                return navigate('/login');
                            }
                            return <Element {...props} />
                        }}

                    />
                </Routes>
            )}
        </>
    );
};

export default ProtectedRoutes;