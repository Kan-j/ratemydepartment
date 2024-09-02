import React from 'react';
import { Document, Page, Text, View, StyleSheet,Image, Font } from '@react-pdf/renderer';


interface DepartmentReportPDFProps {
  departmentalScore: number;
  departmentStarCount: Record<string, number>;
  likes: string[];
  dislikes: string[];
  improvements: string[];
  departmentName: string;
  year: number;
  quarter: number;
  satisfactionImageUrl: string;
  performanceTrendImageUrl: string;
}

const DepartmentReportPDF: React.FC<DepartmentReportPDFProps> = ({
  departmentalScore,
  departmentStarCount,
  likes,
  dislikes,
  improvements,
  departmentName,
  year,
  quarter,
  satisfactionImageUrl,
  performanceTrendImageUrl,
}) => (
      <Document>
      <Page style={styles.coverPage} orientation="landscape">
            <Text style={styles.departmentName}>
            {departmentName}
            </Text>
            <View style={styles.reportTitleContainer}>
              <Text style={styles.reportTitleMain}>
                Internal Customer Satisfaction Survey
              </Text>
              <Text style={styles.reportSubTitle}>Departmental Report</Text>
              <Text style={styles.reportQuarterAndYear}> Q{quarter}, {year}</Text>
            </View>
            
            <View style={styles.footer}>
              <Image src={'/assets/vra-logo.jpg'} style={{ width: '150px', height: 'auto' }} />
              <Text style={styles.footerDepartment}>Corporate Strategy Department</Text>
            </View>
      </Page>

      {/* Second Page */}
      <Page style={styles.coverPage} orientation="landscape">
            <Text style={styles.secondPageHeader}>
              Departmental Score
            </Text>
            <View style={styles.secondPageContentLayout}>
                <Text style={{fontSize: '120px'}}>{departmentalScore}</Text>
                <Image src={satisfactionImageUrl} style={{ width: '70%', height: 'auto' }} />
            </View>
            <Text style={{color: 'rgb(0, 31, 31)'}}>
            {departmentName} scored {departmentalScore} on the Likert scale. This score is {departmentalScore >= 4.0 ? 'above' : 'below'} the target of 4.0.
            </Text>
            
      </Page>

      <Page style={styles.coverPage} orientation="landscape">
      <Text style={styles.likesHeader}>
                  Performance Trend for 2024
            </Text>
            <View style={
               {flex:1,
               justifyContent: 'center',
               flexDirection:'row',
               alignItems: 'center',
               gap: '2'}
            }>
                <Image src={performanceTrendImageUrl} style={{ width: '70%', height: 'auto' }} />
            </View>            
      </Page>

      <Page style={styles.coverPage} orientation="landscape">
            <Text style={styles.likesHeader}>
                Positive Feedback
                </Text>
            <View style={{marginTop: '30px', gap:'15px', marginBottom: '40px'}}>
              {likes.map((item, index)=>{
                return(
                  <View key={index}>
                      <Text style={{color: 'rgb(0, 31, 31)'}}>•	{item}</Text>
                  </View>
                )
              })}
            </View>
            
            <Text style={styles.likesHeader}>
            Negative Feedback
            </Text>
            <View style={{marginTop: '30px', gap:'15px', marginBottom: '40px'}}>
              {dislikes.map((item, index)=>{
                return(
                  <View key={index}>
                      <Text style={{color: 'rgb(0, 31, 31)'}}>•	{item}</Text>
                  </View>
                )
              })}
            </View>
            

            <Text style={styles.likesHeader}>
              Recommendations
            </Text>
            <View style={{marginTop: '30px', gap:'15px'}}>
              {improvements.map((item, index)=>{
                return(
                  <View key={index}>
                      <Text style={{color: 'rgb(0, 31, 31)'}}>•	{item}</Text>
                  </View>
                )
              })}
            </View>
            
      </Page>
      <Page style={styles.coverPage} orientation="landscape">
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontWeight: 'heavy',fontSize:'110px'}}>Thank You</Text>
        </View>

        <View style={styles.footer}>
          <Image src={'/assets/vra-logo.jpg'} style={{ width: '150px', height: 'auto' }} />
          <Text style={styles.footerDepartment}>Corporate Strategy Department</Text>
        </View>
      </Page>
      
    </Document>
    );


    // Font.register({
    //   family: 'Montserrat',
    //   src: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap'
    // });

const styles = StyleSheet.create({
  coverPage: {
    paddingTop: 45,
    paddingBottom: 65,
    paddingHorizontal: 45,
  },
  departmentName: {
    textAlign: 'center',
    fontSize:'36px',
    textTransform:"uppercase",
    marginBottom: 100,
    marginTop:10,
    fontWeight: 'heavy',
    fontFamily: 'Helvetica'

  },
  reportTitleContainer: {
    flex:1,
    alignItems:'center',
    fontFamily: 'Helvetica'
  },
  reportTitleMain: {
    textAlign: 'center',
    fontSize:'36px',
    fontFamily: 'Helvetica'
  },
  reportSubTitle: {
    textAlign: 'center',
    fontSize:'36px',
    marginBottom:10,
    fontFamily: 'Helvetica'
  },
  reportQuarterAndYear:{
    textAlign: 'center',
    fontWeight:'demibold',
    fontSize: '16px',
  },
  footer:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  footerDepartment: {
    fontSize: '18px',
  },
  secondPageHeader: {
    fontWeight: 'black',
    fontFamily: 'Helvetica',
    fontSize:'36px',
    textAlign: 'left'
  },
  secondPageContentLayout: {
    flex:1,
    justifyContent: 'space-between',
    flexDirection:'row',
    alignItems: 'center',
    gap: '2'
  },
  likesHeader: {
    fontWeight: 800,
    fontFamily: 'Helvetica',
    fontSize:'18px',
    textAlign: 'left',
  }
});

export default DepartmentReportPDF;

