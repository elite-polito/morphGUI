import React from "react";
import { Container, Row, Col, Card, Badge, ProgressBar } from "react-bootstrap";

function DashboardApp({
  revenueData, categoryData, userMetrics, productPerformance, regionData,
  handleWidgetClick, colorScheme
}) {
  const scheme = {
    blue:{ bg:"#f8f9fa", grad:"linear-gradient(135deg,#667eea 0%,#764ba2 100%)" },
    green:{ bg:"#f8f9fa", grad:"linear-gradient(135deg,#11998e 0%,#38ef7d 100%)" },
    purple:{ bg:"#f8f9fa", grad:"linear-gradient(135deg,#667eea 0%,#764ba2 100%)" },
  }[colorScheme] || { bg:"#f8f9fa", grad:"linear-gradient(135deg,#667eea 0%,#764ba2 100%)" };

  const fmtK = (n)=>`$${(n/1000).toFixed(0)}k`;

  const Metric = ({title,value,sub,onClick})=>(
    <Card className="border-0 shadow-sm" onClick={onClick}>
      <Card.Body>
        <div className="text-uppercase text-muted small fw-semibold mb-1">{title}</div>
        <div className="fs-3 fw-bold">{value}</div>
        {sub && <div className="small fw-semibold text-success">{sub}</div>}
      </Card.Body>
    </Card>
  );

  const BarChart = ({data})=>{
    const max = Math.max(...data.values, 1);
    return (
      <div className="d-flex align-items-end gap-2" style={{height:300,padding:20}}>
        {data.values.map((v,i)=>(
          <div key={i} title={`${data.labels[i]} • ${fmtK(v)}`}
               style={{flex:1,minWidth:18,height:`${(v/max)*100}%`,background:scheme.grad,borderRadius:4}} />
        ))}
      </div>
    );
  };

  const Regions = ({data})=>{
    const total = data.values.reduce((a,b)=>a+b,0) || 1;
    return data.labels.map((l,i)=>{
      const pct = (100*data.values[i]/total);
      return (
        <div key={l} className="mb-3">
          <div className="d-flex justify-content-between small mb-1">
            <strong>{l}</strong><span className="text-muted">{fmtK(data.values[i])}</span>
          </div>
          <ProgressBar style={{height:8,background:"#e9ecef"}}>
            <div style={{width:`${pct}%`,background:scheme.grad,borderRadius:4,height:8}} />
          </ProgressBar>
        </div>
      );
    });
  };

  return (
    <div style={{background:scheme.bg,minHeight:"100vh",padding:"20px 0 40px"}}>
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <h2 className="fw-bold mb-0">Analytics Dashboard</h2>
            <small className="text-muted">Monitor your business performance</small>
          </Col>
        </Row>

        {/* Metrics */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Metric
              title="Total Revenue"
              value={fmtK(revenueData.total)}
              sub={`↑ ${revenueData.growth}% from last period`}
              onClick={()=>handleWidgetClick({type:"revenue", data:revenueData})}
            />
          </Col>
          <Col md={3} className="mb-3">
            <Metric
              title="Total Users"
              value={userMetrics.totalUsers.toLocaleString()}
              sub={`↑ ${userMetrics.growthRate}% growth rate`}
              onClick={()=>handleWidgetClick({type:"users", data:userMetrics})}
            />
          </Col>
          <Col md={3} className="mb-3">
            <Metric
              title="Active Users"
              value={userMetrics.activeUsers.toLocaleString()}
              onClick={()=>handleWidgetClick({type:"active", data:userMetrics})}
            />
            <div className="text-muted small mt-1">
              {((userMetrics.activeUsers/userMetrics.totalUsers)*100).toFixed(1)}% of total
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <Metric
              title="New Users"
              value={userMetrics.newUsers.toLocaleString()}
              onClick={()=>handleWidgetClick({type:"new", data:userMetrics})}
            />
            <div className="text-muted small mt-1">This month</div>
          </Col>
        </Row>

        {/* Charts */}
        <Row className="mb-4">
          <Col lg={8} className="mb-3">
            <Card className="border-0 shadow-sm" style={{minHeight:400}}>
              <Card.Header className="bg-white border-0">
                <h6 className="mb-0">Revenue Overview</h6>
              </Card.Header>
              <Card.Body><BarChart data={revenueData}/></Card.Body>
            </Card>
          </Col>

          <Col lg={4} className="mb-3">
            <Card className="border-0 shadow-sm" style={{minHeight:400}}>
              <Card.Header className="bg-white border-0">
                <h6 className="mb-0">Sales by Region</h6>
              </Card.Header>
              <Card.Body><Regions data={regionData}/></Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Products */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm" style={{minHeight:400}}>
              <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Top Products</h6>
                <Badge bg="secondary">{productPerformance.length} items</Badge>
              </Card.Header>
              <Card.Body className="pt-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>{["Product","Sales","Revenue","Growth"].map(h=>
                        <th key={h} className="text-muted small fw-semibold">{h}</th>
                      )}</tr>
                    </thead>
                    <tbody>
                      {productPerformance.map(p=>(
                        <tr key={p.id}>
                          <td className="fw-semibold">{p.name}</td>
                          <td>{p.sales.toLocaleString()}</td>
                          <td>${p.revenue.toLocaleString()}</td>
                          <td className={p.growth>=0?"text-success fw-semibold":"text-danger fw-semibold"}>
                            {p.growth>=0?"↑":"↓"} {Math.abs(p.growth)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
