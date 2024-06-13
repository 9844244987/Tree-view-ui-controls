import React, { useState } from 'react';
import xml2js from 'xml-js';

const Xml4 = () => {
  const [xmlData, setXmlData] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});

  const fetchXmlData = async () => {
    try {
      const response = await fetch('/Sample.xml');
      const xmlString = await response.text();
      const parsedData = xml2js.xml2js(xmlString, { compact: true });
      setXmlData(parsedData);
    } catch (error) {
      console.error('Error fetching XML data:', error);
    }
  };

  const toggleExpand = (path) => {
    setExpandedNodes((prevState) => ({
      ...prevState,
      [path]: !prevState[path],
    }));
  };

  const renderXmlNode = (node, path = '', level = 0) => {
    if (!node) return null;

    const { _attributes, _text, _cdata, ...children } = node;
    const isExpanded = expandedNodes[path];
    const indent = '  '.repeat(level); // Indentation based on the depth of the node

    return (
      <>
        <tr>
          <td>{indent}{Object.keys(children).length > 0 && (
            <button onClick={() => toggleExpand(path)}>
              {isExpanded ? '-' : '+'}
            </button>
          )}</td>
          <td>{JSON.stringify(_attributes)}</td>
          <td>{_text || _cdata}</td>
        </tr>
        {isExpanded && Object.keys(children).map((tagName, index) => (
          <React.Fragment key={index}>
            {Array.isArray(children[tagName])
              ? children[tagName].map((childNode, childIndex) => (
                  <React.Fragment key={childIndex}>
                    <tr>
                      <td>{indent + tagName}</td>
                      <td colSpan="2">
                        {renderXmlNode(childNode, `${path}/${tagName}[${childIndex}]`, level + 1)}
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              : (
                <tr>
                  <td>{indent + tagName}</td>
                  <td colSpan="2">
                    {renderXmlNode(children[tagName], `${path}/${tagName}`, level + 1)}
                  </td>
                </tr>
              )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div>
      <button onClick={fetchXmlData}>Fetch XML Data</button>
      {xmlData && (
        <div>
          <h2>XML Data Table</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Controls</th>
                <th>Attributes</th>
                <th>Inner HTML</th>
              </tr>
            </thead>
            <tbody>
              {renderXmlNode(xmlData)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Xml4;
