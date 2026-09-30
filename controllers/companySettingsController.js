const companySettingsModel =
    require("../models/companySettingsModel");


// =====================================================
// GET COMPANY SETTINGS
// =====================================================

const getCompanySettings = async (req, res) => {

    try {

        const company =
            await companySettingsModel.getCompanySettings();


        if (!company) {

            return res.status(404).json({
                success: false,
                message: "Company settings not found"
            });

        }


        res.json({
            success: true,
            data: company
        });


    } catch (error) {

        console.error(
            "Get company settings error:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// =====================================================
// UPDATE COMPANY SETTINGS
// =====================================================

const updateCompanySettings = async (req, res) => {

    try {

        const {

            company_name,
            company_code,
            address,
            city,
            state,
            country,
            pincode,
            phone,
            email,
            website,
            logo,
            gst_number,
            cin,
            pan

        } = req.body;


        if (
            !company_name ||
            !String(company_name).trim()
        ) {

            return res.status(400).json({
                success: false,
                message: "Company name is required"
            });

        }


        const updatedCompany =
            await companySettingsModel.updateCompanySettings({

                company_name:
                    String(company_name).trim(),

                company_code:
                    company_code
                        ? String(company_code).trim()
                        : "",

                address:
                    address
                        ? String(address).trim()
                        : "",

                city:
                    city
                        ? String(city).trim()
                        : "",

                state:
                    state
                        ? String(state).trim()
                        : "",

                country:
                    country
                        ? String(country).trim()
                        : "",

                pincode:
                    pincode
                        ? String(pincode).trim()
                        : "",

                phone:
                    phone
                        ? String(phone).trim()
                        : "",

                email:
                    email
                        ? String(email).trim()
                        : "",

                website:
                    website
                        ? String(website).trim()
                        : "",

                logo:
                    logo
                        ? String(logo).trim()
                        : "",

                gst_number:
                    gst_number
                        ? String(gst_number).trim()
                        : "",

                cin:
                    cin
                        ? String(cin).trim()
                        : "",

                pan:
                    pan
                        ? String(pan).trim()
                        : ""

            });


        res.json({

            success: true,

            message:
                "Company settings updated successfully",

            data:
                updatedCompany

        });


    } catch (error) {

        console.error(
            "Update company settings error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


module.exports = {

    getCompanySettings,
    updateCompanySettings

};