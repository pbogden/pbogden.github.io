# Crosswalk

Crosswalk of learning goals -- KB & PB -- from KB's 11 modules (slides), 12th module: project presentations

| module  | KB  | PB  | differences |
| ---     | --- | --- | ---         |
| 1 -- Intro | course expectations and policies | ✓ | |
|            | tools and resources | ✓ | PB: git, command-line, colab |
|            | introduction to data science | ✓ | |
|            | introduction to R | reproducibility | PB: github-classroom (no notebooks) |
| 2 -- Data Viz | common statistical graphics | ✓ | |
| | how to look at data | ✓ | |
| | key ingredients of useful plots | ✓ | |
| | grammar of graphics | seaborn vs matplotlib | ggplot vs OO nature of Python |
| 3 -- Data Processing | Types of data | ✓ | PB calls the module: 03-Tidy |
| | Structuring data for data science | ✓ | |
| | Data wrangling and transformation | ✓ | |
| | Summarizing data | ✓ | |
| 4 -- EDA | What is EDA? | in PB modules 2 & 3 | not a separate module |
| | Variation and covariation in data | '' | '' | 
| | “Interesting” visualizations | '' | '' | 
| 5 -- SQL | What is relational data? | ✓ | PB calls the module: 04-Relational |
| | What is SQL? | ✓ | |
| | Basics of relational algebra | ✓ | |
| | Types of joins | ✓ | |
| 6 -- Modeling I | What are the goals of modeling? | ✓ | PB calls it: 05-Regression |
| | Why linear regression? | ✓ | |
| | Fitting linear models | ✓ | |
| | Model diagnostics | ✓ | |
| 7 -- Modeling II | Criteria for evaluating models | ✓ | PB calls it: 07-Resampling |
| | Overfitting and how to avoid it | ✓ | |
| | Performing cross-validation | ✓ | |
| | Selecting models | ✓ | |
| 8 -- Statistical Inference | What is statistical inference? | in 05-Regression | not a separate module |
| | Distributions of statistics | '' | '' |
| | Confidence intervals | '' | '' |
| | Hypothesis tests  | '' | '' |
| 9 -- SupervisedML  | What are the goals of supervised ML? | ✓ | PB calls it: 06-Classification |
| | Building classification models | ✓ | |
| | Dealing with class imbalance | ✓ | |
| 10 -- UnsupervisedML | Goals of unsupervised ML | ✓ | PB calls it: 09-Unsupervised |
| | Dimension reduction | ✓ | |
| | Clustering | ✓ | |
| 11 -- Text mining | Structuring text data | ✓ | PB calls it: 11-Text |
| | EDA using term frequency | ✓ | |
| | Sentiment analysis | ✓ | |
| | Topic models | ✓ | |
| 12 -- Projects | ✓ | |

#### Following content only in PB's version

| module  | KB | PB |
| ---     | ---   | --- |
| 10-Trees | N/A | beyond linear models with Trees & SVMs |
| | N/A | decision-tree basics, random forest, ensembles of weak learners |
| | N/A | SVM with nonlinear kernel (relationship to logistic regression) |
| | N/A | intro to image processing (faces and digits) |
| 12-Deep | N/A | optional module (there is no related homework) |
| | N/A | comes before projects only when holidays and scheduling allow |
| | N/A | intro to neural networks (perceptron, relationship to logistic regression) |
| | N/A | function approximation, nonlinearity, stochastic GD (tensorflow playground) |

## PB outline (detail)

* 1 -- Intro
  * Course overview, expectations and policies
  * Tools -- Git, Github vs Colab, DS packages
  * Intro to data visualization
  * Reproducible analysis -- Git & Github vs Jupyter & Colab
* 2 -- DataViz
  * Simple statistical plots (histograms, box plots, scatterplots)
  * Relationship to probability distributions (normalizing histograms)
  * Random number generators (central limit theorem demo)
  * Seaborn & Matplotlib -- OO nature of core DS packages
* 3 -- Tidy 
  * Processing and managing tidy/tabular data -- faceting
  * Converting messy data to tidy table
  * Pandas & Numpy -- OO nature, troubleshooting indexing gotchas (mistakes without Errors)
* 4 -- Relational
  * Intro to relational databases & SQL
  * Working with relational tables 
  * SQLite -- loading and querying a database with SQLite3
* 5 -- Regression
  * Intro to linear regression with statsmodels
  * Statistical hypothesis testing (p-values, $R^2$, etc.) with statsmodels
  * Data processing with 2-D arrays, processing pipelnes, the estimators API
  * Visualizing residuals, assessing model assumptions (e.g., Gaussian errors)
* 6 -- Classification
  * Categorical data, one-hot encoding
  * Linear regression vs logistic regression (polynomials vs sigmoid)
  * Optimization criteria (relatiohship between least squares & maximum likelihood)
* 7 -- Resampling
  * Train/test split, validation set, cross validation
  * Bias-variance tradeoff, estimating standard errors
  * Troubleshooting non-random data, missing data, problematic resampling algorithms
* 8 -- Selection
  * high-dimensional data and the curse of dimensionality (ISLR2 Chapter 6.1-6.4)
  * feature scaling, implications for knn vs logistic regression, algorithmic convergence
  * model/feature selection, regularization
* 9 -- Unsupervised
  * PCA for dimension reduction and clustering (and imputation)
  * K-means, silhouette analysis
  * Processing image datasets as 2-D arrays
* 10 -- Trees
  * beyond linear models (trees and SVMs)
  * decision-tree basics, random forest, ensembles of weak learners, 
  * SVM with nonlinear kernels
  * intro to image processing (faces and digits)
* 11 -- Text
  * Intro to text as high-dimensional data (sparse matrices, timing code execution)
  * Text mining -- structuring, cleaning, tf-idf
  * Text classification (naive Bayes), topic modeling (LSA & PCA)
* 12 -- Projects
* 13 -- Deep (optional, no related homework)
  * Deep-learning module comes before projects only when holidays and scheduling allows
  * Introduction to neural networks (perceptron and relatihsip to logistic regression)
  * Function approximation, nonlinearity, stochastic GD (tensorflow playground)

## Approach & Issues

* Data visualization & EDA
  * These aren't separate modues -- EDA is part of Data visualization
  * starting point for every dataset/assignment
  * material related to data types & structures are part of 5010 (NaN, int(), etc)
* Reproducibility 
  * colab for prototyping, not permitted for assignments (github-classroom instead)
  * concise communications -- results summarized markdown
  * command-line reproducility, modular code, DRY, Makefiles, nicely organized repo
* Flipped
  * ISL & PDS selected reading in advance of in-class exercises
  * poll everywhere instead of quizzes
  * in-class exercises in small groups
  * homeworks reinforce and extend in-class exercises
  * no midterm or final -- emphasis on homeworks instead
  * resubmission policy (max grade 90%)
* Applications of OOP
  * Estimator API
  * Strengths and weaknesses (Matplotlib <-> Seaborn, Numpy <-> Pandas)
  * Python vs C/C++
* Projects
  * data/story/stakeholder requirement
  * no kaggle datasets
  * these invariably emphasize data management and processing
* Challenges -- wide range of backgrounds
  * some students don't have align background
  * some don't have linear algebra
  * many students have lots of SQL
