const TitleTextFont = "Ethnocentric";
const DescriptionTextFont = "SambaIsDead";
const MainColor = "rgb(0, 224, 255, .4)";
const MainColorAttenuated = "rgb(0, 224, 255, .2)";
const MainBorderStyle = `.5px solid ${MainColor}`;
const MainBorderAttenuatedStyle = `.5px solid ${MainColorAttenuated}`;
const LargeBorderStyle = `1px solid ${MainColor}`;
export const MainTextColor = "white";

export const HeaderBorderStyle = {
    marginTop: 2,
    marginRight: 2,
    marginLeft: 2,
    border: MainBorderStyle,
    borderTopRadius: 20,
    borderBottom: 0,
}

export const BodyBorderStyle = {
    marginRight: 2,
    marginLeft: 2,
    border: MainBorderStyle,
    borderBottom: 0,
    borderTop: MainBorderStyle,
}

export const FooterBorderStyle = {
    marginRight: 2,
    marginLeft: 2,
    marginBottom: 2,
    border: MainBorderStyle,
    borderTop: 0,
    borderBottomRadius: 20,
}

export const MainTextStyle = {
    fontFamily: TitleTextFont,
}

export const DescriptionTextStyle = {
    fontFamily: DescriptionTextFont,
    color: MainTextColor,
    fontSize: "3xl",
}

export const DescriptionSmallTextStyle = {
    fontFamily: DescriptionTextFont,
    color: MainTextColor,
    fontSize: "xl",
}

export const MainButtonStyle = {
    height: "60px",
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    border: MainBorderStyle,
    bg: "linear-gradient(308.45deg, rgba(0, 224, 255, 0.4) -94.97%, rgba(0, 224, 255, 0.05) 70.06%);",
    fontFamily: TitleTextFont,
    color: MainTextColor,
    _hover: {
        bg: "rgb(0, 224, 255, 0.2)",
        border: LargeBorderStyle,
    },
}

export const SecondButtonStyle = {
    height: "60px",
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    border: MainBorderStyle,
    bg: "linear-gradient(308.45deg, rgba(0, 224, 255, 0.4) -94.97%, rgba(0, 224, 255, 0.05) 70.06%);",
    fontFamily: TitleTextFont,
    color: MainTextColor,
    _hover: {
        bg: "rgb(0, 224, 255, 0.2)",
        border: LargeBorderStyle,
    },
}

export const AddressBorderStyle = {
    p: "2",
    height: "60px",
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 20,
    border: MainBorderStyle,
    bg: "linear-gradient(308.45deg, rgba(0, 224, 255, 0.4) -94.97%, rgba(0, 224, 255, 0.05) 70.06%);",
    fontFamily: TitleTextFont,
    color: MainTextColor,
    _hover: {
        bg: "rgb(0, 224, 255, 0.2)",
        border: LargeBorderStyle,
    },
}

export const BalanceBorderStyle = {
    p: "2",
    height: "60px",
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    border: MainBorderStyle,
    bg: "linear-gradient(308.45deg, rgba(0, 224, 255, 0.4) -94.97%, rgba(0, 224, 255, 0.05) 70.06%);",
    fontFamily: TitleTextFont,
    color: MainTextColor,
}

export const ChainBorderStyle = {
    p: "2",
    height: "60px",
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 0,
    border: MainBorderStyle,
    bg: "linear-gradient(308.45deg, rgba(0, 224, 255, 0.4) -94.97%, rgba(0, 224, 255, 0.05) 70.06%);",
    fontFamily: TitleTextFont,
    color: MainTextColor,
}

export const MainCardStyle = {
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: ['100%', '100%', '50%', '50%'],
    // bg: "linear-gradient(308.45deg, rgba(0, 224, 255, 0.4) -94.97%, rgba(0, 224, 255, 0.05) 70.06%)",
    bg: 'linear-gradient(308.45deg, rgba(0, 224, 255) -90.97%, rgba(0, 0, 0) 80%);',

    border: ".5px solid rgb(0, 224, 255, 0.4)",
}

export const NavItemActiveStyle = {

    borderTop: MainBorderAttenuatedStyle,
    borderRight: MainBorderAttenuatedStyle,
    borderLeft: MainBorderAttenuatedStyle,
    borderBottom: "1px solid rgb(0, 224, 255)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
    width: 100,
    textAlign: "center",
    bg: "linear-gradient(152.1deg, rgba(0, 224, 255, 0.4) -28.68%, rgba(0, 224, 255, 0.01) 66.42%)",
    color: "rgb(0, 224, 255)",
}

export const NavItemNonActiveStyle = {

    cursor: "pointer",
    border: "0px",
    bg: "transparent",
    borderRadius: 0,
    width: 100,
    textAlign: "center",
    color: "white",
    _hover: {
        borderTop: ".5px solid rgba(0, 224, 255, 0.2)",
        borderRight: ".5px solid rgba(0, 224, 255, 0.2)",
        borderLeft: ".5px solid rgba(0, 224, 255, 0.2)",
        borderBottom: ".5px solid rgba(0, 224, 255, 0.2)",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 20,
        // bg: "rgb(0, 224, 255, 0.2)"
        bg: "linear-gradient(152.1deg, rgba(0, 224, 255, 0.4), rgba(0, 224, 255, 0.01) )",
    }
}

export const MainListStyle = {
    flexDirection: 'column-reverse',
    border: MainBorderStyle,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    height: "200px",
    overflowY: "auto",
    width: "100%",
    padding: "3",
    textAlign: "center",
}

export const MainInputStyle = {

    bg: "linear-gradient(308.45deg, rgba(0, 224, 255, 0.4) -94.97%, rgba(0, 224, 255, 0.05) 70.06%)",
}

export const MainInputFieldStyle = {
    fontSize: "3xl",
    fontFamily: DescriptionTextFont,
    color: MainTextColor,
    border: MainBorderStyle,
    borderTopRadius: 10,
    borderBottomRadius: 0,
    _hover: {
        bg: MainColorAttenuated,
        border: LargeBorderStyle,
    },
    _focus: {
        outline: 'none',
        boxShadow: '0px',
    },
    _focusVisible: {
        outline: 'none',
        boxShadow: '0px',
    }
}

export const MainNumberIncrementStepperStyle = {
    border: "0px",
    bg: "transparent",
}

export const FooterTextStyle = {
    fontFamily: DescriptionTextFont,
    color: MainTextColor,
    fontSize: "xl",
}


/**
 * Toast styles
 */
export const ToastBaseStyle = {

    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    border: "5px solid white",
    fontFamily: TitleTextFont,
    color: MainTextColor,
}

const warningColor = "#C05621";
export const ToastWarningStyle = {

    ...ToastBaseStyle,
    border: `5px solid ${warningColor}`,
    bg: warningColor,
}

const errorColor = "#C53030";
export const ToastErrorStyle = {

    ...ToastBaseStyle,
    border: `5px solid ${errorColor}`,
    bg: errorColor,
}

const infoColor = "#2B6CB0";
export const ToastInfoStyle = {

    ...ToastBaseStyle,
    border: `5px solid ${infoColor}`,
    bg: infoColor,
}

const successColor = "#2F855A";
export const ToastSuccessStyle = {

    ...ToastBaseStyle,
    border: `5px solid ${successColor}`,
    bg: successColor,
}
