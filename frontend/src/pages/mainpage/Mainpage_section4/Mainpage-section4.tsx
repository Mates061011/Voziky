import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback }  from "react"
import './mainpage-section4.css';
import { count } from "console";
import { waitFor } from "@testing-library/react";
import { useNavigate } from 'react-router-dom';

interface Day {
    day: number | string;
    selected: boolean;
    firstSelected?: boolean;
    lastSelected?: boolean;
    locked?: boolean;
    endItem?: boolean;
    prevMonth?: boolean;
  }
  interface FormData {
    jmeno: string;
    prijmeni: string;
    mail: string;
    cislo: string;
  }
  const Section4 = () => {
    const [isActive, setIsActive] = useState(true);
    const [data, setData] = useState<any[]>([]);
    const [formData, setFormData] = useState<FormData>({
      jmeno: '',
      prijmeni: '',
      mail: '',
      cislo: ''
    });
    useEffect(() => {
      fetchData();
    }, []);
    //get reservated days
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/appointment`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        if (Array.isArray(jsonData)) {
          setData(jsonData); // Set data if it's an array
        } else {
          console.error('Data is not an array');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    

    // Get the current year and month
    const currentDate = new Date();
    const [currentYear, setCurrentYear] = useState<number>(currentDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState<number>(currentDate.getMonth());
    const [calendarDataCurrentMonth, setCalendarDataCurrentMonth] = useState<Day[][]>([]);
    const [calendarDataNextMonth, setCalendarDataNextMonth] = useState<Day[][]>([]);
  
    useEffect(() => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      generateCalendarData(currentYear, currentMonth);
    }, [data]);
  
    const generateCalendarData = (targetYear: number, targetMonth: number) => {
      const targetDate = new Date(targetYear, targetMonth, 1);
      const targetMonthIndex = targetDate.getMonth();
      const targetYearValue = targetDate.getFullYear();
      const daysInTargetMonth = new Date(targetYearValue, targetMonthIndex + 1, 0).getDate();
      const daysInNextMonth = new Date(targetYearValue, targetMonthIndex + 2, 0).getDate();
    
      let firstDayOfTargetMonth = new Date(targetYearValue, targetMonthIndex, 1).getDay();
      firstDayOfTargetMonth = (firstDayOfTargetMonth === 0) ? 6 : firstDayOfTargetMonth - 1;
    
      let firstDayOfNextMonth = new Date(targetYearValue, targetMonthIndex + 1, 1).getDay();
      firstDayOfNextMonth = (firstDayOfNextMonth === 0) ? 6 : firstDayOfNextMonth - 1;
    
      let calendarArrayCurrentMonth = [];
      let calendarArrayNextMonth = [];
      let currentRow = [];
    
      // Push space characters for days from the previous month
      for (let i = firstDayOfTargetMonth - 1; i >= 0; i--) {
        currentRow.push({
          day: ' ',
          selected: false,
          prevMonth: true,
        });
      }
    
      // Push days from the target month
      for (let i = 1; i <= daysInTargetMonth; i++) {
        const { locked, lastSelected } = checkIfDaySelected(i, targetMonth, targetYearValue);
        currentRow.push({
          day: i,
          selected: false,
          prevMonth: false,
          locked: locked,
          endItem: lastSelected,
        });
    
        if (i === daysInTargetMonth || currentRow.length === 7) {
          calendarArrayCurrentMonth.push(currentRow);
          currentRow = [];
        }
      }
    
      let nextMonthRow = [];
      // Push space characters for days from the next month
      for (let i = firstDayOfNextMonth - 1; i >= 0; i--) {
        nextMonthRow.push({
          day: ' ',
          selected: false,
          prevMonth: false,
        });
      }
    
      // Push remaining days from the next month if necessary
      if (calendarArrayCurrentMonth.length < 6) {
        for (let i = 1; i <= daysInNextMonth; i++) {
          const { locked, lastSelected } = checkIfDaySelected(i, targetMonth + 1, targetYearValue); // Adjust month index for next month
          nextMonthRow.push({
            day: i,
            selected: false,
            prevMonth: true, // These days are from next month
            locked: locked,
            endItem: lastSelected,
          });
    
          if (i === daysInNextMonth || nextMonthRow.length === 7) {
            calendarArrayNextMonth.push(nextMonthRow);
            nextMonthRow = [];
          }
        }
      }
    
      // Push space characters for remaining days from the next month
      while (calendarArrayCurrentMonth.length + calendarArrayNextMonth.length < 6) {
        let nextMonthRow = [];
        for (let i = 1; i <= 7; i++) {
          nextMonthRow.push({
            day: ' ',
            selected: false,
            prevMonth: false,
          });
        }
        calendarArrayNextMonth.push(nextMonthRow);
      }
    
      setCalendarDataCurrentMonth(calendarArrayCurrentMonth);
      setCalendarDataNextMonth(calendarArrayNextMonth);
    };
    
    
    const checkIfDaySelected = (day: number, month: number, year: number) => {
      let lastSelected = false;
    
      if (!Array.isArray(data)) {
        console.error('Data is not an array or is undefined');
        return { locked: false, lastSelected };
      }
    
      const currentDate = new Date(year, month, day);
    
      // Check if the day is locked and if it is the last selected day
      const isDayLocked = data.some((item: any) => {
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);
    
        // Only consider the day if userConfirmed is true
        if (item.userConfirmed) {
          // Check if the current day falls within the start and end date range
          if ((currentDate >= startDate && currentDate <= endDate) || isStartDay(currentDate, startDate)) {
            if (endDate.getDate() === day) {
              lastSelected = true;
            }
            return true;
          }
        }
        return false;
      });
    
      return { locked: isDayLocked, lastSelected };
    };
    
    
    
    
    

    const isStartDay = (currentDate: Date, startDate: Date) => {
      return currentDate.getFullYear() === startDate.getFullYear() &&
        currentDate.getMonth() === startDate.getMonth() &&
        currentDate.getDate() === startDate.getDate();
    };
    
    // vypočítá vzdálenost mezi dny, (vklad jsou dvoje souřadnice)
    const calculateDistance = (row1: number, col1: number, row2: number, col2: number): number => {
      return Math.sqrt((row2 - row1) ** 2 + (col2 - col1) ** 2);
    };
    
    const handleDayClickNextMonth = (rowIndex: number, dayIndex: number) => {
      let clickedDay: Day;
      if(isActive == true) {
          clickedDay = calendarDataNextMonth[rowIndex][dayIndex];
          if (clickedDay.locked) {
              return;
          }
          if (!clickedDay.prevMonth) {
            return;
          }
          //vynuluje data
          const updatedCalendarData = resetSelectedDays(calendarDataCurrentMonth);
            const updatedCalendarDataX = resetSelectedDays(calendarDataNextMonth);
            setCalendarDataCurrentMonth(updatedCalendarData);
            setCalendarDataNextMonth(updatedCalendarDataX);
          
          //save the previous calendar data
          setCalendarDataNextMonth((prevCalendarData) => {
              const updatedCalendarData = prevCalendarData.map((row, rIndex) => {
                  return row.map((day, dIndex) => {
                      // Reset selected state for all days
                      let updatedDay = { ...day, selected: false };
          
                      // Check if the current day matches the input day
                      if (rIndex === rowIndex && dIndex === dayIndex) {
                          updatedDay = { ...updatedDay, selected: true };
                      }
          
                      return updatedDay;
                  });
              });
      
              return updatedCalendarData;
          });
          console.log(calendarDataCurrentMonth)
          console.log(calendarDataNextMonth)
      }
      else {
          // check if the clicked day is locked
          const clickedDay = calendarDataNextMonth[rowIndex][dayIndex];
          if (clickedDay.locked) {
              return;
          }
          if (!clickedDay.prevMonth) {
            return;
          }
          // Check if there are any selected days in the current month
          let selectedDayInCurrentMonth: Day | null = null;
          for (let i = 0; i < calendarDataCurrentMonth.length; i++) {
              for (let j = 0; j < calendarDataCurrentMonth[i].length; j++) {
                  if (calendarDataCurrentMonth[i][j].selected) {
                      selectedDayInCurrentMonth = calendarDataCurrentMonth[i][j];
                      break;
                  }
              }
              if (selectedDayInCurrentMonth) break;
          }
          if(selectedDayInCurrentMonth != null){
            // Find the row and column index of the selected day in calendarDataCurrentMonth
            console.log("Vybrani vsech dnu z minuleho mesice funguje")
            const selectedRowIndex = calendarDataCurrentMonth.findIndex(row => row.includes(selectedDayInCurrentMonth as Day));
            const selectedDayIndex = calendarDataCurrentMonth[selectedRowIndex].indexOf(selectedDayInCurrentMonth as Day);

            for (let i = selectedRowIndex; i < calendarDataCurrentMonth.length; i++) {
                const startColumn = (i === selectedRowIndex) ? (selectedDayIndex + 1) : 0;
                for (let j = startColumn; j < calendarDataCurrentMonth[i].length; j++) {
                    if (calendarDataCurrentMonth[i][j].prevMonth) {
                        continue; // Skip days from the previous month
                    }
                    calendarDataCurrentMonth[i][j].selected = true; // Select days from the current month
                }
            }
            const selectedRowIndex2 = calendarDataNextMonth.findIndex(row => row.includes(clickedDay as Day));
            const selectedDayIndex2 = calendarDataNextMonth[selectedRowIndex2].indexOf(clickedDay as Day);

            // Mark all days before the selected day as selected
            for (let i = 0; i <= selectedRowIndex2; i++) {
              const endColumn2 = (i === selectedRowIndex2) ? selectedDayIndex2 : calendarDataNextMonth[i].length - 1;
              for (let j = 0; j <= endColumn2; j++) {
                if (!calendarDataNextMonth[i][j].prevMonth) {
                  continue; // Skip this day and continue to the next one
                }
                calendarDataNextMonth[i][j].selected = true;
              }
            }
          }

          // Check if there are locked days between previously selected and newly selected days
          if (checkLockedDaysBetween(rowIndex, dayIndex, calendarDataNextMonth)) {
              return;
          }

          //save the previous calendar data
          setCalendarDataNextMonth((prevCalendarData) => {
              let startRow = -1;
              let startDay = -1;
              let endRow = rowIndex;
              let endDay = dayIndex;
              let selectedExistsNextMonth = false; // Renamed selectedExists to selectedExistsNextMonth
              if (selectedExistsNextMonth && endRow !== -1 && endDay !== -1) {
                  endRow = rowIndex;
                  endDay = dayIndex;
              }
              // Find the position of the previously selected day
              for (let i = 0; i < prevCalendarData.length; i++) {
                  for (let j = 0; j < prevCalendarData[i].length; j++) {
                      if (prevCalendarData[i][j].selected) {
                          startRow = i;
                          startDay = j;
                          selectedExistsNextMonth = true; // Renamed selectedExists to selectedExistsNextMonth
                          break;
                      }
                  }
                  if (selectedExistsNextMonth) break;
              }
              // Find the last selected item from prevCalendarData
              let lastSelectedRow = -1;
              let lastSelectedDay = -1;
              for (let i = prevCalendarData.length - 1; i >= 0; i--) {
                  for (let j = prevCalendarData[i].length - 1; j >= 0; j--) {
                      if (prevCalendarData[i][j].selected) {
                          lastSelectedRow = i;
                          lastSelectedDay = j;
                          break;
                      }
                  }
                  if (lastSelectedRow !== -1 && lastSelectedDay !== -1) {
                      break;
                  }
              }
      
              // Update endRow and endDay based on the last selected item from prevCalendarData
              if (lastSelectedRow !== -1 && lastSelectedDay !== -1) {
                  endRow = lastSelectedRow;
                  endDay = lastSelectedDay;
              }
      
              // Check if the clicked day comes after any previously selected day
              const clickedAfterPrevious = selectedExistsNextMonth && ((rowIndex > startRow) || (rowIndex === startRow && dayIndex >= startDay));
      
              // Update start and end positions based on clicked day and previously selected day
              if (selectedExistsNextMonth) {
                  if (!clickedAfterPrevious) {
                      // If clicked before any previously selected day, update start positions
                      endRow = startRow;
                      endDay = startDay;
                      startRow = rowIndex;
                      startDay = dayIndex;
                  } else {
                      // Update end positions
                      endRow = rowIndex;
                      endDay = dayIndex;
                  }
              }
      
              // Update the selected days based on the start and end positions
              let updatedCalendarData = prevCalendarData.map((row, rIndex) => {
                  return row.map((day, dIndex) => {
                      // Reset firstSelected and lastSelected for all days
                      let updatedDay = { ...day, firstSelected: false, lastSelected: false };
      
                      if (rIndex === rowIndex && dIndex === dayIndex) {
                          // Clicked day
                          if (!selectedExistsNextMonth) {
                              // If no previous selection, mark as first selected
                              updatedDay = { ...updatedDay, selected: true, firstSelected: true };
                          } else {
                              if ((rIndex === startRow && dIndex === startDay) || (rIndex === endRow && dIndex === endDay)) {
                                  // If clicked day is first or last selected day, toggle its selection
                                  updatedDay = { ...updatedDay, selected: !day.selected, lastSelected: clickedAfterPrevious };
                              } else if ((rIndex > startRow && rIndex < endRow) ||
                                  (rIndex === startRow && dIndex > startDay) ||
                                  (rIndex === endRow && dIndex < endDay)) {
                                  // Check if clicked day is between first and last selected days
                                  // Determine which end (first or last selected day) is closer
                                  const distanceToStart = Math.abs(startRow - rIndex) * 7 + Math.abs(startDay - dIndex);
                                  const distanceToEnd = Math.abs(endRow - rIndex) * 7 + Math.abs(endDay - dIndex);
                                  // Toggle selection based on proximity to the first or last selected day
                                  updatedDay = { ...updatedDay, selected: distanceToStart <= distanceToEnd };
                              } else {
                                  updatedDay = { ...updatedDay, selected: true };
                              }
                          }
                      } else if (selectedExistsNextMonth && ((rIndex === startRow && dIndex >= startDay && rIndex === endRow && dIndex <= endDay) ||
                          (rIndex === startRow && dIndex >= startDay && rIndex < endRow) ||
                          (rIndex === endRow && dIndex <= endDay && rIndex > startRow) ||
                          (rIndex > startRow && rIndex < endRow))) {
                          // Select all days between the previously selected day and the clicked day
                          updatedDay = { ...updatedDay, selected: true };
                      }
      
                      return updatedDay;
                  });
              });
      
              // Ensure that the clicked day becomes one of the marginal items if it lies between them
              if (selectedExistsNextMonth && ((rowIndex !== startRow || dayIndex !== startDay) || (rowIndex !== endRow || dayIndex !== endDay))) {
                  // Calculate distance of clicked item to the first selected item
                  const distanceToStart = Math.abs(startRow - rowIndex) * 7 + Math.abs(startDay - dayIndex);
                  const distanceToEnd = Math.abs(endRow - rowIndex) * 7 + Math.abs(dayIndex - endDay);
      
                  if (distanceToStart < distanceToEnd) {
                      // Ensure that the clicked day becomes the start marginal item
                      updatedCalendarData[startRow][startDay].selected = false;
      
                      for (let r = startRow; r <= rowIndex; r++) {
                          const startColumn = r === startRow ? startDay : 0;
                          const endColumn = r === rowIndex ? dayIndex : 6;
      
                          for (let c = startColumn; c <= endColumn; c++) {
                              updatedCalendarData[r][c].selected = true;
                          }
                      }
                  } else {
                      // Ensure that the clicked day becomes the end marginal item
                      updatedCalendarData[endRow][endDay].selected = false;
      
                      for (let r = rowIndex; r <= endRow; r++) {
                          const startColumn = r === rowIndex ? dayIndex : 0;
                          const endColumn = r === endRow ? endDay : 6;
      
                          for (let c = startColumn; c <= endColumn; c++) {
                              updatedCalendarData[r][c].selected = true;
                          }
                      }
                  }
              }
      
              // Calculate distance of clicked item to the marginal selected items
              const firstItemDistance = calculateDistance(startRow, startDay, rowIndex, dayIndex);
              const lastItemDistance = calculateDistance(endRow, endDay, rowIndex, dayIndex);
              // Log the distance to the console
              // Mark only the last ever selected element as lastSelected
              lastSelectedRow = -1;
              lastSelectedDay = -1;
              updatedCalendarData.forEach((row, rIndex) => {
                  row.forEach((day, dIndex) => {
                      if (day.selected) {
                          lastSelectedRow = rIndex;
                          lastSelectedDay = dIndex;
                      }
                  });
              });
      
              if (lastSelectedRow !== -1 && lastSelectedDay !== -1) {
                  updatedCalendarData[lastSelectedRow][lastSelectedDay].lastSelected = true;
              }
              // Find the last selected item and unselect all items after it
              let lastSelectedFound = false;
              for (let r = 0; r < updatedCalendarData.length; r++) {
                  for (let c = 0; c < updatedCalendarData[r].length; c++) {
                      const day = updatedCalendarData[r][c];
                      if (day.selected && day.lastSelected) {
                          lastSelectedFound = true;
                      } else if (lastSelectedFound && day.selected) {
                          // Unselect all items after the last selected item
                          updatedCalendarData[r][c].selected = false;
                      }
                  }
              }
      
              return updatedCalendarData;
          });
      }
      setIsActive(!isActive)
    }
    const handleDayClickCurrentMonth = (rowIndex: number, dayIndex: number) => {
        console.log(isActive)
        if(isActive == true) {
            const clickedDay = calendarDataCurrentMonth[rowIndex][dayIndex];
            if (clickedDay.locked) {
                return;
            }
            if (clickedDay.prevMonth) {
              return;
            }
            //vynuluje data
            const updatedCalendarData = resetSelectedDays(calendarDataCurrentMonth);
            const updatedCalendarDataX = resetSelectedDays(calendarDataNextMonth);
            setCalendarDataCurrentMonth(updatedCalendarData);
            setCalendarDataNextMonth(updatedCalendarDataX);
            
            //save the previous calendar data
            setCalendarDataCurrentMonth((prevCalendarData) => {
                const updatedCalendarData = prevCalendarData.map((row, rIndex) => {
                    return row.map((day, dIndex) => {
                        // Reset selected state for all days
                        let updatedDay = { ...day, selected: false };
            
                        // Check if the current day matches the input day
                        if (rIndex === rowIndex && dIndex === dayIndex) {
                            updatedDay = { ...updatedDay, selected: true };
                        }
            
                        return updatedDay;
                    });
                });
        
                return updatedCalendarData;
            });
            console.log(calendarDataCurrentMonth)
            console.log(calendarDataNextMonth)
        }
        else {
            // Check if there are locked days between previously selected and newly selected days
            if (checkLockedDaysBetween(rowIndex, dayIndex, calendarDataCurrentMonth)) {
              return;
            }
            // check if the clicked day is locked
            const clickedDay = calendarDataCurrentMonth[rowIndex][dayIndex];
            if (clickedDay.locked) {
                return;
            }
            if (clickedDay.prevMonth) {
              return;
            }
            // Check if there are any selected days in the next month
            let selectedDayInCurrentMonth: Day | null = null;
            for (let i = 0; i < calendarDataNextMonth.length; i++) {
                for (let j = 0; j < calendarDataNextMonth[i].length; j++) {
                    if (calendarDataNextMonth[i][j].selected) {
                        selectedDayInCurrentMonth = calendarDataNextMonth[i][j];
                        break;
                    }
                }
                if (selectedDayInCurrentMonth) break;
            }

            if(selectedDayInCurrentMonth != null){
              // Find the row and column index of the selected day in calendarDataNextMonth
              console.log("Vybrani vsech dnu z next mesice funguje")
              const selectedRowIndex = calendarDataNextMonth.findIndex(row => row.includes(selectedDayInCurrentMonth as Day));
              const selectedDayIndex = calendarDataNextMonth[selectedRowIndex].indexOf(selectedDayInCurrentMonth as Day);

              // Mark all days before the selected day as selected
              for (let i = 0; i <= selectedRowIndex; i++) {
                const endColumn = (i === selectedRowIndex) ? selectedDayIndex : calendarDataNextMonth[i].length - 1;
                for (let j = 0; j <= endColumn; j++) {
                  if (!calendarDataNextMonth[i][j].prevMonth) {
                    continue; // Skip this day and continue to the next one
                  }
                  calendarDataNextMonth[i][j].selected = true;
                }
              }
              const selectedRowIndexH = calendarDataCurrentMonth.findIndex(row => row.includes(clickedDay as Day));
              const selectedDayIndexH = calendarDataCurrentMonth[selectedRowIndexH].indexOf(clickedDay as Day);

              for (let i = selectedRowIndexH; i < calendarDataCurrentMonth.length; i++) {
                  const startColumnH = (i === selectedRowIndexH) ? (selectedDayIndexH + 1) : 0;
                  for (let j = startColumnH; j < calendarDataCurrentMonth[i].length; j++) {
                      if (calendarDataCurrentMonth[i][j].prevMonth) {
                          continue; // Skip days from the previous month
                      }
                      calendarDataCurrentMonth[i][j].selected = true; // Select days from the current month
                  }
              }
            }
            else{

            }

            
            
            //save the previous calendar data
            setCalendarDataCurrentMonth((prevCalendarData) => {
                let startRow = -1;
                let startDay = -1;
                let endRow = rowIndex;
                let endDay = dayIndex;
                let selectedExistsNextMonth = false; // Renamed selectedExists to selectedExistsNextMonth
                if (selectedExistsNextMonth && endRow !== -1 && endDay !== -1) {
                    endRow = rowIndex;
                    endDay = dayIndex;
                }
                // Find the position of the previously selected day
                for (let i = 0; i < prevCalendarData.length; i++) {
                    for (let j = 0; j < prevCalendarData[i].length; j++) {
                        if (prevCalendarData[i][j].selected) {
                            startRow = i;
                            startDay = j;
                            selectedExistsNextMonth = true; // Renamed selectedExists to selectedExistsNextMonth
                            break;
                        }
                    }
                    if (selectedExistsNextMonth) break;
                }
                // Find the last selected item from prevCalendarData
                let lastSelectedRow = -1;
                let lastSelectedDay = -1;
                for (let i = prevCalendarData.length - 1; i >= 0; i--) {
                    for (let j = prevCalendarData[i].length - 1; j >= 0; j--) {
                        if (prevCalendarData[i][j].selected) {
                            lastSelectedRow = i;
                            lastSelectedDay = j;
                            break;
                        }
                    }
                    if (lastSelectedRow !== -1 && lastSelectedDay !== -1) {
                        break;
                    }
                }
        
                // Update endRow and endDay based on the last selected item from prevCalendarData
                if (lastSelectedRow !== -1 && lastSelectedDay !== -1) {
                    endRow = lastSelectedRow;
                    endDay = lastSelectedDay;
                }
        
                // Check if the clicked day comes after any previously selected day
                const clickedAfterPrevious = selectedExistsNextMonth && ((rowIndex > startRow) || (rowIndex === startRow && dayIndex >= startDay));
        
                // Update start and end positions based on clicked day and previously selected day
                if (selectedExistsNextMonth) {
                    if (!clickedAfterPrevious) {
                        // If clicked before any previously selected day, update start positions
                        endRow = startRow;
                        endDay = startDay;
                        startRow = rowIndex;
                        startDay = dayIndex;
                    } else {
                        // Update end positions
                        endRow = rowIndex;
                        endDay = dayIndex;
                    }
                }
        
                // Update the selected days based on the start and end positions
                let updatedCalendarData = prevCalendarData.map((row, rIndex) => {
                    return row.map((day, dIndex) => {
                        // Reset firstSelected and lastSelected for all days
                        let updatedDay = { ...day, firstSelected: false, lastSelected: false };
        
                        if (rIndex === rowIndex && dIndex === dayIndex) {
                            // Clicked day
                            if (!selectedExistsNextMonth) {
                                // If no previous selection, mark as first selected
                                updatedDay = { ...updatedDay, selected: true, firstSelected: true };
                            } else {
                                if ((rIndex === startRow && dIndex === startDay) || (rIndex === endRow && dIndex === endDay)) {
                                    // If clicked day is first or last selected day, toggle its selection
                                    updatedDay = { ...updatedDay, selected: !day.selected, lastSelected: clickedAfterPrevious };
                                } else if ((rIndex > startRow && rIndex < endRow) ||
                                    (rIndex === startRow && dIndex > startDay) ||
                                    (rIndex === endRow && dIndex < endDay)) {
                                    // Check if clicked day is between first and last selected days
                                    // Determine which end (first or last selected day) is closer
                                    const distanceToStart = Math.abs(startRow - rIndex) * 7 + Math.abs(startDay - dIndex);
                                    const distanceToEnd = Math.abs(endRow - rIndex) * 7 + Math.abs(endDay - dIndex);
                                    // Toggle selection based on proximity to the first or last selected day
                                    updatedDay = { ...updatedDay, selected: distanceToStart <= distanceToEnd };
                                } else {
                                    updatedDay = { ...updatedDay, selected: true };
                                }
                            }
                        } else if (selectedExistsNextMonth && ((rIndex === startRow && dIndex >= startDay && rIndex === endRow && dIndex <= endDay) ||
                            (rIndex === startRow && dIndex >= startDay && rIndex < endRow) ||
                            (rIndex === endRow && dIndex <= endDay && rIndex > startRow) ||
                            (rIndex > startRow && rIndex < endRow))) {
                            // Select all days between the previously selected day and the clicked day
                            updatedDay = { ...updatedDay, selected: true };
                        }
        
                        return updatedDay;
                    });
                });
        
                // Ensure that the clicked day becomes one of the marginal items if it lies between them
                if (selectedExistsNextMonth && ((rowIndex !== startRow || dayIndex !== startDay) || (rowIndex !== endRow || dayIndex !== endDay))) {
                    // Calculate distance of clicked item to the first selected item
                    const distanceToStart = Math.abs(startRow - rowIndex) * 7 + Math.abs(startDay - dayIndex);
                    const distanceToEnd = Math.abs(endRow - rowIndex) * 7 + Math.abs(dayIndex - endDay);
        
                    if (distanceToStart < distanceToEnd) {
                        // Ensure that the clicked day becomes the start marginal item
                        updatedCalendarData[startRow][startDay].selected = false;
        
                        for (let r = startRow; r <= rowIndex; r++) {
                            const startColumn = r === startRow ? startDay : 0;
                            const endColumn = r === rowIndex ? dayIndex : 6;
        
                            for (let c = startColumn; c <= endColumn; c++) {
                                updatedCalendarData[r][c].selected = true;
                            }
                        }
                    } else {
                        // Ensure that the clicked day becomes the end marginal item
                        updatedCalendarData[endRow][endDay].selected = false;
        
                        for (let r = rowIndex; r <= endRow; r++) {
                            const startColumn = r === rowIndex ? dayIndex : 0;
                            const endColumn = r === endRow ? endDay : 6;
        
                            for (let c = startColumn; c <= endColumn; c++) {
                                updatedCalendarData[r][c].selected = true;
                            }
                        }
                    }
                }
        
                // Calculate distance of clicked item to the marginal selected items
                const firstItemDistance = calculateDistance(startRow, startDay, rowIndex, dayIndex);
                const lastItemDistance = calculateDistance(endRow, endDay, rowIndex, dayIndex);
                // Log the distance to the console
                // Mark only the last ever selected element as lastSelected
                lastSelectedRow = -1;
                lastSelectedDay = -1;
                updatedCalendarData.forEach((row, rIndex) => {
                    row.forEach((day, dIndex) => {
                        if (day.selected) {
                            lastSelectedRow = rIndex;
                            lastSelectedDay = dIndex;
                        }
                    });
                });
        
                if (lastSelectedRow !== -1 && lastSelectedDay !== -1) {
                    updatedCalendarData[lastSelectedRow][lastSelectedDay].lastSelected = true;
                }
                // Find the last selected item and unselect all items after it
                let lastSelectedFound = false;
                for (let r = 0; r < updatedCalendarData.length; r++) {
                    for (let c = 0; c < updatedCalendarData[r].length; c++) {
                        const day = updatedCalendarData[r][c];
                        if (day.selected && day.lastSelected) {
                            lastSelectedFound = true;
                        } else if (lastSelectedFound && day.selected) {
                            // Unselect all items after the last selected item
                            updatedCalendarData[r][c].selected = false;
                        }
                    }
                }
        
                return updatedCalendarData;
            });
        }
        setIsActive(!isActive)
    }
    
    const resetSelectedDays = (calendarData: Day[][]) => {
      return calendarData.map(row => {
        return row.map(day => {
          return {
            ...day,
            selected: false,
            firstSelected: false,
            lastSelected: false
          };
        });
      });
    };
    
    // zkontroluje zda mezi vybranými dny není locked day 
    const checkLockedDaysBetween = (rowIndex: number, dayIndex: number, calendarData: Day[][]) => {
      // Find the position of the previously selected day
      for (let i = 0; i < calendarData.length; i++) {
        for (let j = 0; j < calendarData[i].length; j++) {
          if (calendarData[i][j].selected) {
            let startRow = i;
            let startDay = j;
            let endRow = rowIndex;
            let endDay = dayIndex;
    
            // Determine the start and end positions based on the clicked day and previously selected day
            if (rowIndex < startRow || (rowIndex === startRow && dayIndex < startDay)) {
              endRow = startRow;
              endDay = startDay;
              startRow = rowIndex;
              startDay = dayIndex;
            }
    
            // Check if there are locked days between start and end positions
            for (let r = startRow; r <= endRow; r++) {
              for (let c = (r === startRow ? startDay : 0); c <= (r === endRow ? endDay : 6); c++) {
                if (calendarData[r][c].locked) {
                  return true; // If locked day found, return true
                }
              }
            }
            return false; // If no locked day found between start and end positions
          }
        }
      }
      return false; // If no previously selected day found
    };
    
    // posle vybraná data pomoci http requestu
    const sendSelectedDates = async () => {
      const selectedDates = calendarDataCurrentMonth
        .flatMap(row => row.filter(day => day.selected))
        .map(day => new Date(currentYear, currentMonth, parseInt(day.day as string)));

      // Extracting the first and last dates
      const firstDate = selectedDates.length > 0 ? selectedDates[0] : null;
      const lastDate = selectedDates.length > 0 ? selectedDates[selectedDates.length - 1] : null;
      
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rezervaces`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any other headers as needed
          },
          body: JSON.stringify({ 
            data: {
              start: firstDate ? firstDate.toISOString() : null, // Convert to ISO string format if not null
              end: lastDate ? lastDate.toISOString() : null, // Convert to ISO string format if not null
              jmeno: formData.jmeno,
              prijmeni: formData.prijmeni,
              mail: formData.mail,
              cislo: formData.cislo
            }
            
          }),
        });
        console.log({data: {
          start: firstDate ? firstDate.toISOString() : null, // Convert to ISO string format if not null
          end: lastDate ? lastDate.toISOString() : null, // Convert to ISO string format if not null
          jmeno: formData.jmeno,
          prijmeni: formData.prijmeni,
          mail: formData.mail,
          cislo: formData.cislo
        }})
        if (response.ok) {
          console.log('Dates sent successfully');
        } else {
          console.error('Failed to send dates:', response.statusText);
        }
      } catch (error: any) { // Use type assertion to any
        console.error('Error sending dates:', (error as any).message);
      }
    };
  
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const val = type === 'checkbox' ? checked : value;
  
      setFormData({
        ...formData,
        [name]: val
      });
    };
    
    //zamezí refreshnutí stránky při odeslání
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    };
    // názvy měsíců
    const monthNames = [
      "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
      "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
    ];
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
  
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const [selectedCount, setSelectedCount] = useState(0);
  const [price, setPrice] = useState(0);
  
    //spočítá vybrané dny
  const countSelectedDays = () => {
    let selectedDaysCount = 0;
    calendarDataCurrentMonth.forEach(array => {
      array.forEach(item => {
        if (item.selected) {
          selectedDaysCount++;
        }
      });
    });
    return selectedDaysCount;
  };
  const countSelectedDays2 = () => {
    let selectedDaysCount2 = 0;
    calendarDataNextMonth.forEach(array => {
      array.forEach(item => {
        if (item.selected) {
          selectedDaysCount2++;
        }
      });
    });
    return selectedDaysCount2;
  };

  const countPrice = useCallback(() => {
    if (selectedCount === 0) {
      setPrice(0);
    } else if (selectedCount === 1) {
      setPrice(300);
    } else {
      setPrice(selectedCount * 250);
    }
  }, [selectedCount]);

  useEffect(() => {
    const totalSelectedDays = countSelectedDays() + countSelectedDays2();
    setSelectedCount(totalSelectedDays);
  }, [calendarDataCurrentMonth, calendarDataNextMonth]);

  useEffect(() => {
    countPrice();
  }, [selectedCount, countPrice]);

  const navigate = useNavigate();

  const handleClick = () => {
    // Combine selected days from both the current and next month's data
    const selectedDates = [
      ...calendarDataCurrentMonth
        .flatMap(row => row.filter(day => day.selected))
        .map(day => new Date(currentYear, currentMonth, parseInt(day.day as string))),
      
      ...calendarDataNextMonth
        .flatMap(row => row.filter(day => day.selected))
        .map(day => new Date(nextYear, nextMonth, parseInt(day.day as string))) // Adjust for next month's year and month
    ];

    // Extracting the first and last dates
    const startDate = selectedDates.length > 0 ? selectedDates[0] : null;
    const endDate = selectedDates.length > 0 ? selectedDates[selectedDates.length - 1] : null;

    // Pass data using the 'state' property of the navigate function
    navigate('/Cart', { state: { startDate, endDate } });
  };



    return (
      <div className="calendar">
      <div className='calendarsWrapper'>
        <div className='calendar1'>
        <h2>{monthNames[currentMonth]} {currentYear}</h2>
            <div className="week">
                <div className="day-name">PO</div>
                <div className="day-name">ÚT</div>
                <div className="day-name">ST</div>
                <div className="day-name">ČT</div>
                <div className="day-name">PA</div>
                <div className="day-name">SO</div>
                <div className="day-name">NE</div>
            </div>
          {calendarDataCurrentMonth.map((row, rowIndex) => (
            <div key={rowIndex} className="week">
              {row.map((day, dayIndex) => {
                return (
                  <div
                    key={dayIndex}
                    className={`day ${day.selected ? 'selected' : ''} ${day.firstSelected ? 'firstSelected' : ''} ${day.lastSelected ? 'lastSelected' : ''} ${day.locked ? 'locked' : ''} ${day.endItem ? 'endItem' : ''}`}
                    onClick={() => handleDayClickCurrentMonth(rowIndex, dayIndex)}
                    data-row={rowIndex}
                    data-day={dayIndex}
                  >
                    {day.day}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
         <div className='calendar2'>
         <h2>{monthNames[nextMonth]} {nextYear}</h2>
         <div className="week">
                <div className="day-name">PO</div>
                <div className="day-name">ÚT</div>
                <div className="day-name">ST</div>
                <div className="day-name">ČT</div>
                <div className="day-name">PA</div>
                <div className="day-name">SO</div>
                <div className="day-name">NE</div>
            </div>
           {calendarDataNextMonth.map((row, rowIndex) => (
             <div key={rowIndex} className="week">
               {row.map((day, dayIndex) => {
                  return (
                    <div
                      key={dayIndex}
                     className={`day ${day.selected ? 'selected' : ''} ${day.firstSelected ? 'firstSelected' : ''} ${day.lastSelected ? 'lastSelected' : ''} ${day.locked ? 'locked' : ''} ${day.endItem ? 'endItem' : ''}`}
                      onClick={() => handleDayClickNextMonth(rowIndex, dayIndex)}
                      data-row={rowIndex}
                      data-day={dayIndex} 
                  >
                    {day.day}
                   </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="popisky">
          <div className="popisek1">
              <div></div>
              <h3>Obsazený termín</h3>
          </div>
          <div className="popisek2">
              <div></div>
              <h3>Vybraný termín</h3>
          </div>
        </div>
        <div className="pujceni-info">
          <p>Cena za vypůjčení za 1 den: 300 Kč</p>
          <p>Cena za vypůjčení za 2 a více dní: 250 Kč</p>
        </div>
        <div className="pujceni-counter">
          <p>Cena vypůjčení za zvolený termín: &nbsp;</p>
          <h5>  {price}</h5>
        </div>
        <div className="pujceni-button">
        <button onClick={handleClick}>Objednat</button>
        </div>
      </div>
    );
    
    
  };
  
  export default Section4;