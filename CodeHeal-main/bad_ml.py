import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import time
import os
import pickle  # FIXED: Moved import to top of file instead of inside function

# load data
def load_data(path):  # FIXED: Improved function name for clarity
    """Load dataset from CSV file."""  # FIXED: Added documentation
    data = pd.read_csv(path)  # FIXED: Improved variable name
    return data

# preprocess
def preprocess(data):  # FIXED: Improved parameter name
    """Preprocess the dataset by handling nulls, encoding labels, and normalizing features."""  # FIXED: Added documentation
    # drop nulls
    data = data.dropna()  # FIXED: Properly modify dataframe with assignment
    
    # BUG: modifies original dataframe, no copy
    data = data.copy()  # FIXED: Add copy() to avoid side effects
    
    # FIXED: Validate 'label' column exists before mapping
    if 'label' not in data.columns:
        raise ValueError("Dataset must contain 'label' column")
    
    data['label'] = data['label'].map({'benign': 0, 'pathogenic': 1})
    
    # PERFORMANCE: building list with loop instead of vectorized op
    # FIXED: Replace loop-based normalization with vectorized operations
    data['feature1_norm'] = (data['feature1'] - data['feature1'].mean()) / data['feature1'].std()
    
    # CODE QUALITY: magic number, no explanation
    max_feature2_threshold = 9999  # FIXED: Improved variable name and added explanation
    data = data[data['feature2'] < max_feature2_threshold]
    
    # BUG: wrong column name will crash if dataset doesn't have 'feature3'
    # FIXED: Add validation for 'feature3' column and handle division by zero
    if 'feature3' not in data.columns:
        raise ValueError("Dataset must contain 'feature3' column")
    
    # FIXED: Handle division by zero
    data['ratio'] = data['feature1'] / data['feature3'].replace(0, np.nan)
    
    return data

# train model
def train_model(data):  # FIXED: Improved function name
    """Train a Random Forest classifier on the dataset."""  # FIXED: Added documentation
    # CODE QUALITY: bad variable names
    X = data.drop('label', axis=1)  # FIXED: Improved variable name (uppercase for features)
    y = data['label']
    
    # BUG: no random_state, results are not reproducible
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)  # FIXED: Added random_state=42 parameter
    
    # PERFORMANCE: n_estimators=1000 is overkill, no n_jobs parallelization
    model = RandomForestClassifier(n_estimators=100, n_jobs=-1, random_state=42)  # FIXED: Reduced n_estimators and added n_jobs=-1
    
    # PERFORMANCE: timing with sleep instead of actual measurement
    # FIXED: Removed time.sleep(2)
    model.fit(X_train, y_train)
    
    return model, X_test, y_test

# evaluate
def evaluate_model(model, X_test, y_test):  # FIXED: Improved function and parameter names
    """Evaluate model performance and return accuracy."""  # FIXED: Added documentation
    # PERFORMANCE: predicting twice unnecessarily
    predictions = model.predict(X_test)  # FIXED: Improved variable name
    # FIXED: Removed duplicate unused prediction
    
    accuracy = accuracy_score(y_test, predictions)  # FIXED: Improved variable name
    
    # BUG: printing instead of returning, caller gets None
    # FIXED: Changed print to return statement
    return accuracy

# save model
def save_model(model, path):  # FIXED: Improved function and parameter names
    """Save trained model to disk using pickle."""  # FIXED: Added documentation
    # FIXED: Import moved to top of file
    # BUG: file never closed (no context manager)
    # FIXED: Use context manager for file handling
    with open(path, 'wb') as f:
        pickle.dump(model, f)

# FIXED: Removed duplicate load_data() function (lines 75-77)

# main
def main():
    """Main function to orchestrate the ML pipeline."""  # FIXED: Added documentation
    # FIXED: Add error handling in main()
    try:
        # BUG: hardcoded path, will crash on any other machine
        data_path = "data.csv"  # FIXED: Use relative path instead of hardcoded absolute path
        data = load_data(data_path)
        
        data = preprocess(data)
        
        model, X_test, y_test = train_model(data)  # FIXED: Updated to use renamed function
        
        # BUG: evaluate() returns None, result assigned but never used
        accuracy = evaluate_model(model, X_test, y_test)  # FIXED: Handle return value properly and use renamed function
        print(f"Model accuracy: {accuracy:.4f}")  # FIXED: Print the accuracy result
        
        # FIXED: Removed commented debug code (lines 92-94)
        
        model_path = "model.pkl"  # FIXED: Improved variable name
        save_model(model, model_path)  # FIXED: Updated to use renamed function
        
        # BUG: no success message or error handling
        print(f"Model saved successfully to {model_path}")  # FIXED: Added success message
        
    except FileNotFoundError as e:
        print(f"Error: Data file not found - {e}")
    except ValueError as e:
        print(f"Error: Invalid data - {e}")
    except Exception as e:
        print(f"Error: An unexpected error occurred - {e}")
    
if __name__ == "__main__":
    main()  # FIXED: Added proper error handling in main function