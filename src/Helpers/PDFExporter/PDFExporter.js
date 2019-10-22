import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Model from '../../Models/Models.js'

class PDFExporter extends Model{
    // Create styles
    styles = StyleSheet.create({
        page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
        },
        section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
        }
    });
   
    // Create Document Component
    MyDocument = () => {
        return (
            <Document>
                <Page size="A4" style={this.styles.page}>
                    <View style={this.styles.section}>
                    <Text>Section #1</Text>
                    </View>
                    <View style={this.styles.section}>
                    <Text>Section #2</Text>
                    </View>
                </Page>
            </Document>
        )
    };
    CreateMaintenanceReportPDF = (docData,callback) => {
        super.postReq('/pdf/maintenanereport/create' , docData, (value,error) => {
            if (error === null) {
                console.log(value);
                callback(true);
            } else {
                console.log(error)
                callback(false);
            } 
        })
    }
    ToPDF = () => {
        super.postReq('/pdf/create',{},(value, error) => {
            if (error === null) {
                console.log(value);
            } else {
                console.log(error)
            }
        })
    }
}
export default PDFExporter;