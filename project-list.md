
# Projects -- fall 2023

### PMA -- Portland Museum of Art

* Stakeholder
  * Portland Museum of Art (PMA) leadership (See Alicia Jalbert and/or Dave Munger for contact information)
* Data
  * Data extracted from PMA's data systems are available as an xlsx file.
  * The excel file has utility usage for several PMA buildings -- these data will need to be cleaned up.
  * Climate-related time series data are available from various government agencies.
  * For example, NOAA and [EAI](https://www.eia.gov/opendata/) data are showcased in these observable notebooks:
    * [NOAA hourly weather data](https://observablehq.com/@observablehq/noaa-weather-data-by-major-u-s-city)
    * [EIA OpenData API](https://observablehq.com/@observablehq/eia-opendata-electricity-grid-operation)
    * Note: the 2022 version of this notebook is busted probably because the EIA API changed in March 2023
    * The new API documentation is here: https://www.eia.gov/opendata/documentation.php
* Story
  * Goal is an informative dashboard/visualization for Board of Directors that relates to sustainability & climate.
  CFO and Director of Sustainability will be interested in understanding the relationship to PMA costs.
  For example, PMA was supposed to be saving 5% because of new initiatives but costs went up. 
  Perhaps that was because recent summers were hottest on record. 
  They're interested in relating utility costs/usage to temperature and humidity (especially humidity).

### NECS -- New England Cancer Specialists

* Stakeholder
  * Dr. Christian Thomas, New England Cancer Specialists, Scarborough, Maine & Philip Bogden (primary POC)
  * https://www.newenglandcancerspecialists.org/
* Data
  * Data collection started in late 2023 at New England Cancer Specialists.
  * The dataset will be growing as more patients and organizations participate.
  * Data & data dictionary for 105 patients in [RedCap](https://projectredcap.org/about/) are available as excel files.
* Story
  * Cancer survivors face uncertainty about their future because of the possibility of cancer recurrence. 
  A new dataset permits evaluation of uncertainty and emotional well-being among cancer survivors.
  Preliminary evidence suggests that such prognosic uncertainty might confer benefits because it may give patients 
  a chance to hope for a more favorable outcome. 
  * The New England Cancer Specialists in Maine started collecting data in late 2022 from adult cancer
  survivors presenting for follow-up appointments to discuss surveillance-test results.
  The patients were asked to fill out a survey about their attitudes 
  regarding cancer recurrence, cancer-related distress, and coping strategies, along with sociodemographic 
  information, cancer stage, and cancer status. 
  Patients also completed questions designed to measure health-related quality of life and symptoms.
  * Preliminary results using data from 105 patients suggest a significant association between 
  age and uncertainty about cancer recurrence [cite publication].
  Younger patients (age 49-59) reported higher uncertainty 
  compared to older patients (age 60-89). Other descriptive and correlational data exist in the dataset.
  Initial results demonstrate that high-volume cancer clinic can measure 
  important patient-reported outcomes and cancer survivors’ attitudes towards cancer recurrence.
  Additional data will allow further study of the correlation between patients’ age and their 
  uncertainty about cancer recurrence, and may lead to improved support for cancer survivors.

## 911

* Stakeholders
  * Dr. Christine Lary and Dr. Qingchu Jin (primary POC) at The Roux Institute
  * Dr. Teresa May at MaineHealth
* Story
  * Critical Care Doctors at MaineHealth are using data from cardiac arrest patients in the Intensive Care 
  Unit (ICU) in order to find predictors of good or poor outcomes. One of the databases they're using is the 
  National Emergency Medical System (EMS) Information System (NEMSIS). The NEMSIS database contains all 911 
  calls nationwide. The full dataset for each year is huge. A version has been sampled for cardiac arrest patients
  to look at implications of "rurality." 
  Other factors may be relevant in modeling causal inference. 
  This project builds on previous work, and it will be important to connect with Dr. Jin for guidance.
  Focus areas include: reproducible exploratory data analysis and investigation of the effects of imputation 
  using the MICE and missforest algorithms. These would be precursors to modeling studies.
  A long-term goal (beyond the scope of a 5110 project) would be an app for exploring or visualizing the data.
* Data
  * Original data source: www.nemsis.org
  * A subset of the entire database is available via scientists at The Roux Institute.

## cells

* Stakeholders
  * Roux contacts: Dr. Christine Lary & Dr. Michael Wan
  * MainHealth contacts: Dr. Katherine Motyl
* Story
  * Researchers at MaineHealth and the Roux Institute are collaborating on a clinical trial to collect images 
  of human osteoclast cells (a type of bone cell) from blood samples. The data collection is labor intensive and they've
  only had time to do a rough image analysis. In preparation for more extensive computer-vision analysis
  they're hoping to adapt machine-learning methods that have been developed on mouse cells.
  The goal is to use the AI to detect the cells in these images.
  There are challenges with adapting the mouse-cell analysis to human cells, and they have yet to be understood.
  Dr. Michael Wan, a deep learning expert now in EAI has begun collaborating on this work.
  The goal of the 5110 project will be to put together a reproducible data-processing and analysis pipeline using an 
  existing mouse-image dataset and existing algorithms. In the long run, this could inform the creation of
  an AI-based tool for scientists at MaineHealth.
* Data
  * data will be available via dropbox
* Related
  * http://www.ncbi.nlm.nih.gov/pmc/ar8cles/PMC8186397
  * http://www.ncbi.nlm.nih.gov/pmc/ar8cles/PMC9038109
  * https://github.com/kiharalab/OC_Finder

## MCA -- fall 2023

* Stakeholders
  * Meghan Grabill, Research & Analytics Senior Manager, Maine Connectivity Authority (MCA)
  * Jake Inger, MSDS candidate, The Roux Institute, Northeastern University
* Data
  * Socieconomic data from the [American Community Survey (ACS)](https://www.census.gov/programs-surveys/acs)
  at the U.S. Census. 
  * Broadband data come from the [FCC broadband data collection](https://www.fcc.gov/BroadbandData).
* Story
  * MCA is is a quasi-governmental agency charged with achieving the universal access of affordable
  high-speed broadband in Maine. 
  Allocation of funds need to be distributed in an equitable fashion, and the concept of "digital equity"
  has emerged as an important metric for allocating those funds. The goal of this project is to build on
  ongoing work to define digital equity around the nation and refine it for the state of Maine.
  This project builds on previous work by students in DS 5110 and DS 5010 at The Roux Institute,
  for example: https://ds5010.github.io/broadband-3.
  These culminated in a recent synthesis that's nicely summarized in Jake Inger's 
  [github repo](https://github.com/jinger12/final-maps-update).
  The goal of this project is to use publicly available data to further investigate
  relationships between digital equity and the underlying socieconomic and technical realities in Maine.
  Potential outcomes include, for example, interactive maps that help convey the issues to a non-technical audience.
